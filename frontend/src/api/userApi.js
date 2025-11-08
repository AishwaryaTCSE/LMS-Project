import axios from './axiosInstance';

/**
 * Update user profile.
 * If userId is provided and not 'me', uses /users/:id, otherwise uses /users/me
 * @param {string} userId
 * @param {object} data
 */
export const updateUserProfile = async (userId, data) => {
  try {
    const url = userId ? `/users/${userId}` : '/users/me';
    const response = await axios.put(url, data);
    // backend uses { success: true, data: ... }
    return response.data?.data || response.data;
  } catch (err) {
    console.error('userApi.updateUserProfile error:', err?.response?.data || err.message);
    throw err;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`/users/${userId}`);
    return response.data?.data || response.data;
  } catch (err) {
    console.error('userApi.getUserById error:', err?.response?.data || err.message);
    throw err;
  }
};

export default {
  updateUserProfile,
  getUserById
};
