import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  List, 
  Avatar, 
  Badge, 
  Spin, 
  Select,
  Tooltip,
  Popover,
  message as antMessage
} from 'antd';
import { 
  SendOutlined,
  RobotOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  AudioOutlined,
  LoadingOutlined,
  PaperClipOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const { Option } = Select;

const MessagingSystem = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [aiMode, setAiMode] = useState(null);
  const [smartReplies, setSmartReplies] = useState([]);
  const [generatingReply, setGeneratingReply] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const pollInterval = useRef(null);

  // API functions
  const api = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const fetchMessages = async (userId) => {
    try {
      const response = await api.get(`/messages/conversation/${userId}`);
      setMessages(response.data.data);
      scrollToBottom();
    } catch (error) {
      antMessage.error('Failed to load messages');
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setContacts(response.data.data);
      setLoading(false);
    } catch (error) {
      antMessage.error('Failed to load contacts');
      setLoading(false);
    }
  };

  const sendMessageToServer = async (content, type = 'text', files = null) => {
    try {
      const formData = new FormData();
      formData.append('receiverId', selectedUser.id);
      formData.append('content', content);
      formData.append('type', type);
      formData.append('aiMode', aiMode || '');

      if (files) {
        if (Array.isArray(files)) {
          files.forEach(file => formData.append('files', file));
        } else {
          formData.append('files', files);
        }
      }

      const response = await api.post('/messages/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data.data;
    } catch (error) {
      antMessage.error('Failed to send message');
      throw error;
    }
  };

  const generateSmartReplyFromServer = async (messageId) => {
    try {
      const response = await api.post(`/messages/smart-reply/${messageId}`);
      return response.data.data;
    } catch (error) {
      antMessage.error('Failed to generate smart replies');
      throw error;
    }
  };
  const { user } = useAuth();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user) return;

    const getContacts = async () => {
      await fetchContacts();
    };

    getContacts();
    
    // Poll for new contacts every 30 seconds
    pollInterval.current = setInterval(getContacts, 30000);

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [user]);

  useEffect(() => {
    if (!user || !selectedUser) return;

    // Subscribe to messages between current user and selected user
    const unsubscribeMessages = messageService.subscribeToMessages(
      user.id,
      selectedUser.id,
      (updatedMessages) => {
        setMessages(updatedMessages);
        scrollToBottom();
      }
    );

    return () => {
      unsubscribeMessages();
    };
  }, [user, selectedUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await sendMessageToServer(newMessage.trim());
      setNewMessage('');
      setSmartReplies([]); // Clear smart replies after sending
      await fetchMessages(selectedUser.id);
    } catch (error) {
      antMessage.error('Failed to send message');
    }
  };

  const handleUserSelect = async (contact) => {
    setSelectedUser(contact);
    setSmartReplies([]); // Clear smart replies when switching users
    setAiMode(null); // Reset AI mode when switching users
    
    try {
      // Mark messages as read
      await api.patch(`/messages/read/${contact.id}`);
      // Fetch messages for the selected user
      await fetchMessages(contact.id);
    } catch (error) {
      antMessage.error('Failed to load conversation');
    }
  };

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        await handleSendVoiceMessage(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      mediaRecorder.start();

      // Start recording timer
      let time = 0;
      recordingTimerRef.current = setInterval(() => {
        time++;
        setRecordingTime(time);
        // Auto-stop after 2 minutes
        if (time >= 120) {
          stopRecording();
        }
      }, 1000);
    } catch (err) {
      toast.error('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      clearInterval(recordingTimerRef.current);
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      try {
        const formData = new FormData();
        Array.from(files).forEach(file => {
          formData.append('files', file);
        });
        
        await messageService.sendAttachment(selectedUser.id, formData);
        fileInputRef.current.value = '';
      } catch (err) {
        toast.error('Failed to upload file(s)');
      }
    }
  };

  const handleSendVoiceMessage = async (blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'voice-message.wav');
      await messageService.sendVoiceMessage(selectedUser.id, formData);
    } catch (err) {
      toast.error('Failed to send voice message');
    }
  };

  const handleGenerateSmartReply = async (messageId) => {
    try {
      setGeneratingReply(true);
      const suggestions = await generateSmartReplyFromServer(messageId);
      setSmartReplies(suggestions);
    } catch (error) {
      antMessage.error('Failed to generate smart replies');
    } finally {
      setGeneratingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Contacts Sidebar */}
      <Card className="w-1/4 overflow-auto">
        <List
          dataSource={contacts}
          renderItem={(contact) => (
            <List.Item
              onClick={() => handleUserSelect(contact)}
              className={`cursor-pointer transition-colors ${
                selectedUser?.id === contact.id ? 'bg-blue-50' : ''
              }`}
            >
              <List.Item.Meta
                avatar={
                  <Badge count={contact.unreadCount || 0}>
                    <Avatar src={contact.photoURL}>{contact.displayName[0]}</Avatar>
                  </Badge>
                }
                title={contact.displayName}
                description={contact.lastMessage?.content}
              />
              {contact.lastMessage && (
                <div className="text-xs text-gray-500">
                  {new Date(contact.lastMessage.createdAt?.toDate()).toLocaleString()}
                </div>
              )}
            </List.Item>
          )}
        />
      </Card>

      {/* Messages Area */}
      <Card className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Avatar src={selectedUser.photoURL}>
                    {selectedUser.displayName[0]}
                  </Avatar>
                  <div className="ml-3">
                    <h3 className="font-medium">{selectedUser.displayName}</h3>
                    <p className="text-sm text-gray-500">{selectedUser.role}</p>
                  </div>
                </div>
                
                <Select
                  value={aiMode}
                  onChange={setAiMode}
                  placeholder="AI Assistant Mode"
                  allowClear
                  style={{ width: 200 }}
                >
                  <Option value="tutor">
                    <RobotOutlined /> Tutor Mode
                  </Option>
                  <Option value="writing_assistant">
                    <BulbOutlined /> Writing Assistant
                  </Option>
                  <Option value="code_helper">
                    <ThunderboltOutlined /> Code Helper
                  </Option>
                  <Option value="study_buddy">
                    <RobotOutlined /> Study Buddy
                  </Option>
                </Select>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${
                      message.senderId === user.id ? 'justify-end' : 'justify-start'
                    } mb-4`}
                  >
                    <div className="flex flex-col">
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.senderId === user.id
                            ? 'bg-blue-500 text-white'
                            : message.senderId === 'AI_ASSISTANT'
                            ? 'bg-green-100 border border-green-300'
                            : 'bg-gray-100'
                        }`}
                      >
                        {message.senderId === 'AI_ASSISTANT' && (
                          <div className="flex items-center mb-1 text-sm text-green-600">
                            <RobotOutlined className="mr-1" /> AI Assistant
                          </div>
                        )}
                        {message.type === 'voice' ? (
                          <div>
                            <audio controls src={message.content} className="max-w-full" />
                          </div>
                        ) : message.attachments?.length > 0 ? (
                          <div className="space-y-2">
                            {message.content && <p>{message.content}</p>}
                            {message.attachments.map((file, index) => (
                              <div key={index} className="flex items-center space-x-2 p-2 bg-white rounded border">
                                <PaperClipOutlined />
                                <a 
                                  href={file.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  {file.filename}
                                </a>
                                <span className="text-xs text-gray-500">
                                  ({Math.round(file.size / 1024)}KB)
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>{message.content}</p>
                        )}
                        <span className="text-xs opacity-70">
                          {new Date(message.createdAt?.toDate()).toLocaleString()}
                        </span>
                      </div>
                      
                      {message.senderId !== user.id && message.senderId !== 'AI_ASSISTANT' && (
                        <Button
                          size="small"
                          type="link"
                          onClick={() => handleGenerateSmartReply(message.id)}
                          loading={generatingReply}
                        >
                          Generate Smart Reply
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>

            {/* Smart Replies */}
            {smartReplies.length > 0 && (
              <div className="px-4 py-2 border-t">
                <div className="flex flex-wrap gap-2">
                  {smartReplies.map((reply, index) => (
                    <Button
                      key={index}
                      size="small"
                      onClick={() => {
                        setNewMessage(reply);
                        setSmartReplies([]);
                      }}
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input.TextArea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder={
                      aiMode
                        ? `Type your message (AI ${aiMode.replace('_', ' ')} is active)`
                        : "Type a message..."
                    }
                    autoSize={{ minRows: 1, maxRows: 4 }}
                  />
                </div>
                
                <div className="flex space-x-2">
                  {/* File Upload */}
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    icon={<PaperClipOutlined />}
                    onClick={() => fileInputRef.current.click()}
                  />

                  {/* Voice Recording */}
                  {isRecording ? (
                    <Popover
                      content={
                        <div className="flex items-center space-x-2">
                          <LoadingOutlined className="text-red-500 animate-pulse" />
                          <span>Recording: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
                          <Button
                            size="small"
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={stopRecording}
                          />
                        </div>
                      }
                      visible={true}
                    >
                      <Button
                        type="primary"
                        danger
                        icon={<AudioOutlined />}
                        onClick={stopRecording}
                      />
                    </Popover>
                  ) : (
                    <Button
                      icon={<AudioOutlined />}
                      onClick={startRecording}
                    />
                  )}

                  {/* Send Button */}
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a contact to start messaging
          </div>
        )}
      </Card>
    </div>
  );
};

export default MessagingSystem;