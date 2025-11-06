// forumService.js
import axios from './axiosInstance.js';

export const getForums = async () => {
  try {
    const response = await axios.get('/discussions');
    return response.data;
  } catch (error) {
    console.error('Error fetching forums:', error);
    throw error;
  }
};

export const getThreadById = async (id) => {
  try {
    const response = await axios.get(`/discussions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching thread with id ${id}:`, error);
    throw error;
  }
};

export const createThread = async (data) => {
  try {
    const response = await axios.post('/discussions', data);
    return response.data;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
};

export const replyThread = async (threadId, reply) => {
  try {
    const response = await axios.post(`/discussions/${threadId}/reply`, reply);
    return response.data;
  } catch (error) {
    console.error(`Error replying to thread ${threadId}:`, error);
    throw error;
  }
};

export const getAllThreads = async (filters = {}) => {
  try {
    const response = await axios.get('/discussions/threads', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching all threads:', error);
    throw error;
  }
};

export const getThreadDetail = async (threadId) => {
  try {
    const response = await axios.get(`/discussions/threads/${threadId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching thread ${threadId} details:`, error);
    throw error;
  }
};

export const postComment = async (threadId, commentData) => {
  try {
    const response = await axios.post(`/discussions/threads/${threadId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error(`Error posting comment to thread ${threadId}:`, error);
    throw error;
  }
};
