import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as notificationApi from '../api/notificationApi';
import useAuth from '../hooks/useAuth';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = useMemo(() => items.filter(n => !n.isRead).length, [items]);
  const unreadMessageCount = useMemo(
    () => items.filter(n => !n.isRead && n.type === 'message').length,
    [items]
  );

  const load = useCallback(async () => {
    // Don't try to load if there's no user
    if (!user?._id) {
      setItems([]);
      return;
    }
    
    try {
      setLoading(true);
      const data = await notificationApi.getMyNotifications();
      const list = data?.items || [];
      setItems(list);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      // Don't clear existing notifications on error
      if (error.response?.status === 401) {
        // If unauthorized, clear the items to prevent further errors
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user?._id]);  // Only re-create when user._id changes

  const markAsRead = useCallback(async (id) => {
    await notificationApi.markAsRead(id);
    setItems(prev => prev.map(n => (n._id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await notificationApi.markAllAsRead();
    setItems(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  useEffect(() => {
    let active = true;
    let id;

    const init = async () => {
      if (active && user?._id) {
        await load();
      }
    };

    // Initial load
    init();

    // Only set up polling if user is authenticated
    if (user?._id) {
      id = setInterval(() => {
        if (active) load();
      }, 30000);
    }

    return () => {
      active = false;
      if (id) clearInterval(id);
    };
  }, [load, user?._id]);  // Only re-run when user._id changes

  const value = {
    items,
    unreadCount,
    unreadMessageCount,
    loading,
    reload: load,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);


