import api from './api';

// Analytics functions using backend API
export const trackUserLogin = async (userId) => {
  try {
    await api.post('/analytics/track/login', { userId });
  } catch (error) {
    console.error('Error tracking user login:', error);
  }
};

export const trackMessageSent = async (userId) => {
  try {
    await api.post('/analytics/track/message', { userId });
  } catch (error) {
    console.error('Error tracking message sent:', error);
  }
};

export const trackCourseView = async (userId, courseId) => {
  try {
    await api.post('/analytics/track/course-view', { userId, courseId });
  } catch (error) {
    console.error('Error tracking course view:', error);
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getUserAnalytics = async (userId) => {
  try {
    const response = await api.get(`/analytics/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    throw error;
  }
};

export const getDailyStats = async (startDate, endDate) => {
  try {
    const response = await api.get('/analytics/daily-stats', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    throw error;
  }
};

// Polling functions to simulate real-time updates
let dashboardStatsPollingInterval = null;
let userAnalyticsPollingInterval = null;

export const startDashboardStatsPolling = (callback, interval = 30000) => {
  const fetchAndCallback = async () => {
    try {
      const stats = await getDashboardStats();
      callback(stats);
    } catch (error) {
      console.error('Polling error:', error);
    }
  };

  // Initial fetch
  fetchAndCallback();

  // Set up polling
  dashboardStatsPollingInterval = setInterval(fetchAndCallback, interval);

  // Return cleanup function
  return () => {
    if (dashboardStatsPollingInterval) {
      clearInterval(dashboardStatsPollingInterval);
      dashboardStatsPollingInterval = null;
    }
  };
};

export const startUserAnalyticsPolling = (userId, callback, interval = 30000) => {
  const fetchAndCallback = async () => {
    try {
      const analytics = await getUserAnalytics(userId);
      callback(analytics);
    } catch (error) {
      console.error('Polling error:', error);
    }
  };

  // Initial fetch
  fetchAndCallback();

  // Set up polling
  userAnalyticsPollingInterval = setInterval(fetchAndCallback, interval);

  // Return cleanup function
  return () => {
    if (userAnalyticsPollingInterval) {
      clearInterval(userAnalyticsPollingInterval);
      userAnalyticsPollingInterval = null;
    }
  };
};

// Legacy Firebase compatibility functions
export const subscribeToDashboardStats = (callback) => {
  return startDashboardStatsPolling(callback);
};

export const subscribeToUserAnalytics = (userId, callback) => {
  return startUserAnalyticsPolling(userId, callback);
};