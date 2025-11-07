import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const sendMessage = async (messageData) => {
  const response = await axios.post(`${API_BASE}/messages/send`, messageData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const sendMessageWithFile = async (formData) => {
  const response = await axios.post(`${API_BASE}/messages/send`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getConversation = async (userId, page = 1) => {
  const response = await axios.get(`${API_BASE}/messages/conversation/${userId}?page=${page}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getConversations = async () => {
  const response = await axios.get(`${API_BASE}/messages/conversations`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const markAsRead = async (messageIds) => {
  const response = await axios.patch(`${API_BASE}/messages/read`, { messageIds }, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getSuggestion = async (conversation) => {
  const response = await axios.post(`${API_BASE}/messages/suggest`, { conversation }, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const uploadVoiceMessage = async (audioFile) => {
  const formData = new FormData();
  formData.append('audio', audioFile);
  
  const response = await axios.post(`${API_BASE}/messages/voice`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};