import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Avatar, 
  Divider, 
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { Send, ArrowBack, AttachFile } from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

const ConversationDetail = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participant, setParticipant] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // Mock data for the conversation
  const mockConversation = {
    _id: conversationId,
    participant: {
      _id: 'student123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/path/to/avatar.jpg'
    },
    messages: [
      {
        _id: '1',
        sender: 'instructor',
        content: 'Hi John, how can I help you with the assignment?',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        _id: '2',
        sender: 'student123',
        content: 'I\'m having trouble with question 3. Could you explain it in more detail?',
        timestamp: new Date(Date.now() - 1800000)
      },
      {
        _id: '3',
        sender: 'instructor',
        content: 'Of course! Question 3 is about...',
        timestamp: new Date()
      }
    ]
  };

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch the conversation from your API
        // const response = await axios.get(`/api/conversations/${conversationId}`);
        // setMessages(response.data.messages);
        // setParticipant(response.data.participant);
        
        // Using mock data for now
        setMessages(mockConversation.messages);
        setParticipant(mockConversation.participant);
      } catch (err) {
        console.error('Error fetching conversation:', err);
        setError('Failed to load conversation. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsSending(true);
      
      // In a real app, you would send the message to your API
      // await axios.post(`/api/conversations/${conversationId}/messages`, {
      //   content: newMessage
      // });
      
      // For now, just add the message to the local state
      const message = {
        _id: Date.now().toString(),
        sender: 'instructor', // In a real app, this would be the current user's ID
        content: newMessage,
        timestamp: new Date()
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Avatar 
          src={participant?.avatar} 
          alt={participant?.name}
          sx={{ width: 40, height: 40 }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight="medium">
            {participant?.name || 'Unknown User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {participant?.email || ''}
          </Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Box 
        sx={{ 
          flex: 1, 
          p: 2, 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        {messages.map((message) => (
          <Box
            key={message._id}
            sx={{
              alignSelf: message.sender === 'instructor' ? 'flex-end' : 'flex-start',
              maxWidth: '70%'
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: message.sender === 'instructor' ? 'primary.light' : 'grey.100',
                color: message.sender === 'instructor' ? 'primary.contrastText' : 'text.primary'
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  textAlign: 'right',
                  mt: 0.5,
                  opacity: 0.8,
                  color: message.sender === 'instructor' ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary'
                }}
              >
                {format(new Date(message.timestamp), 'h:mm a')}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          display: 'flex',
          gap: 1
        }}
      >
        <IconButton>
          <AttachFile />
        </IconButton>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isSending}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={!newMessage.trim() || isSending}
          startIcon={isSending ? <CircularProgress size={20} /> : <Send />}
        >
          {isSending ? 'Sending...' : 'Send'}
        </Button>
      </Box>
    </Box>
  );
};

export default ConversationDetail;