import { 
  collection, 
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  increment,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Analytics Document Structure in Firestore:
// analytics/
//   - dashboard/
//     - stats
//     - userGrowth[]
//     - courseEngagement[]
//     - dailyStats/
//       - YYYY-MM-DD/
//         - activeUsers
//         - messagesSent
//         - coursesViewed
//   - users/
//     - userId/
//       - lastLogin
//       - totalLogins
//       - messagesSent
//       - coursesViewed

export const trackUserLogin = async (userId) => {
  const userStatsRef = doc(db, 'analytics', 'users', userId);
  const timestamp = serverTimestamp();

  try {
    await setDoc(userStatsRef, {
      lastLogin: timestamp,
      totalLogins: increment(1)
    }, { merge: true });

    // Update daily stats
    const today = new Date().toISOString().split('T')[0];
    const dailyStatsRef = doc(db, 'analytics', 'dashboard', 'dailyStats', today);
    
    await setDoc(dailyStatsRef, {
      activeUsers: increment(1),
      date: today
    }, { merge: true });
  } catch (error) {
    console.error('Error tracking user login:', error);
  }
};

export const trackMessageSent = async (userId) => {
  const userStatsRef = doc(db, 'analytics', 'users', userId);
  const today = new Date().toISOString().split('T')[0];
  const dailyStatsRef = doc(db, 'analytics', 'dashboard', 'dailyStats', today);

  try {
    await Promise.all([
      setDoc(userStatsRef, {
        messagesSent: increment(1)
      }, { merge: true }),
      
      setDoc(dailyStatsRef, {
        messagesSent: increment(1),
        date: today
      }, { merge: true })
    ]);
  } catch (error) {
    console.error('Error tracking message sent:', error);
  }
};

export const trackCourseView = async (userId, courseId) => {
  const userStatsRef = doc(db, 'analytics', 'users', userId);
  const today = new Date().toISOString().split('T')[0];
  const dailyStatsRef = doc(db, 'analytics', 'dashboard', 'dailyStats', today);

  try {
    await Promise.all([
      setDoc(userStatsRef, {
        coursesViewed: increment(1)
      }, { merge: true }),
      
      setDoc(dailyStatsRef, {
        coursesViewed: increment(1),
        date: today
      }, { merge: true })
    ]);
  } catch (error) {
    console.error('Error tracking course view:', error);
  }
};

export const subscribeToDashboardStats = (callback) => {
  const dashboardRef = doc(db, 'analytics', 'dashboard');
  
  return onSnapshot(dashboardRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

export const subscribeToUserAnalytics = (userId, callback) => {
  const userStatsRef = doc(db, 'analytics', 'users', userId);
  
  return onSnapshot(userStatsRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

export const getDailyStats = async (startDate, endDate) => {
  const stats = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dailyStatsRef = doc(db, 'analytics', 'dashboard', 'dailyStats', dateStr);
    const snapshot = await getDoc(dailyStatsRef);

    stats.push({
      date: dateStr,
      ...snapshot.exists() ? snapshot.data() : {
        activeUsers: 0,
        messagesSent: 0,
        coursesViewed: 0
      }
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return stats;
};