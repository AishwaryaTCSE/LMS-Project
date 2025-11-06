// src/pages/Instructor/Messages.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiMessageSquare, 
  FiUser, 
  FiPaperclip, 
  FiMic, 
  FiSmile,
  FiSend,
  FiChevronLeft,
  FiMoreVertical,
  FiCheck,
  FiClock,
  FiChevronDown
} from 'react-icons/fi';

const InstructorMessages = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Mock data - replace with actual data from your API
  const conversations = [
    {
      id: 1,
      name: 'Alex Johnson',
      avatar: 'AJ',
      lastMessage: 'Hey, I have a question about the assignment...',
      time: '10:30 AM',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Taylor Smith',
      avatar: 'TS',
      lastMessage: 'Thanks for the feedback on my project!',
      time: 'Yesterday',
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: 'Jordan Lee',
      avatar: 'JL',
      lastMessage: 'When is the next class scheduled?',
      time: '2 days ago',
      unread: 0,
      online: true
    },
    {
      id: 4,
      name: 'Casey Kim',
      avatar: 'CK',
      lastMessage: 'I submitted my assignment, please check.',
      time: '3 days ago',
      unread: 0,
      online: false
    },
  ];

  const messages = [
    { id: 1, sender: 'student', text: 'Hi, I have a question about the assignment', time: '10:00 AM' },
    { id: 2, sender: 'instructor', text: 'Sure, what would you like to know?', time: '10:05 AM', read: true },
    { id: 3, sender: 'student', text: 'I m not sure how to approach question 3', time: '10:10 AM' },
    { id: 4, sender: 'student', text: 'Can you give me some hints?', time: '10:10 AM' },
  ];

  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startNewChat = () => {
    // Implementation for starting a new chat
    console.log('Starting new chat...');
  };

  const sendMessage = () => {
    if (message.trim() === '') return;
    // Implementation for sending message
    console.log('Sending message:', message);
    setMessage('');
  };

  // Auto-select first conversation on larger screens
  useEffect(() => {
    if (window.innerWidth >= 768 && conversations.length > 0 && !activeChat) {
      setActiveChat(conversations[0]);
    }
  }, [conversations, activeChat]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar - Conversation List */}
      <div className={`${showMobileChat ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
            <button 
              onClick={startNewChat}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            >
              <FiMessageSquare className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search messages"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div 
              key={conversation.id}
              className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${activeChat?.id === conversation.id ? 'bg-blue-50' : ''}`}
              onClick={() => {
                setActiveChat(conversation);
                setShowMobileChat(true);
              }}
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                  {conversation.avatar}
                </div>
                {conversation.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.name}</h3>
                  <span className="text-xs text-gray-500">{conversation.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
              </div>
              {conversation.unread > 0 && (
                <div className="ml-2 bg-indigo-600 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                  {conversation.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${!showMobileChat && 'hidden'} md:flex flex-col flex-1 bg-white`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <button 
                  className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => setShowMobileChat(false)}
                >
                  <FiChevronLeft className="h-5 w-5 text-gray-500" />
                </button>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                    {activeChat.avatar}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base font-medium text-gray-900">{activeChat.name}</h3>
                    <p className="text-xs text-gray-500">
                      {activeChat.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                  <FiMoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'instructor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                        msg.sender === 'instructor' 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-white border border-gray-200 rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                        msg.sender === 'instructor' ? 'text-indigo-100' : 'text-gray-400'
                      }`}>
                        <span>{msg.time}</span>
                        {msg.sender === 'instructor' && (
                          <span>
                            {msg.read ? (
                              <FiCheck className="h-3 w-3 text-blue-300" />
                            ) : (
                              <FiClock className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                  <FiPaperclip className="h-5 w-5" />
                </button>
                <div className="flex-1 mx-2">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <FiSmile className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <FiMic className="h-5 w-5" />
                  </button>
                  <button 
                    className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={sendMessage}
                  >
                    <FiSend className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
              <FiMessageSquare className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select a conversation or start a new one
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={startNewChat}
              >
                <FiMessageSquare className="-ml-1 mr-2 h-5 w-5" />
                New Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorMessages;