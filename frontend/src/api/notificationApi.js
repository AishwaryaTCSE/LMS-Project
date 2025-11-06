import axios from './axiosInstance';

export const getMyNotifications = async () => {
  const res = await axios.get('/notifications');
  // Backend wraps with { success, data }
  return res.data?.data || res.data;
};

export const markAsRead = async (id) => {
  const res = await axios.patch(`/notifications/${id}/read`);
  return res.data?.data || res.data;
};

export const markAllAsRead = async () => {
  const res = await axios.patch('/notifications/read-all');
  return res.data?.data || res.data;
};


