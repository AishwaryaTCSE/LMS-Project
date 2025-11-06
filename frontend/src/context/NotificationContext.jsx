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
    if (!user) return;
    try {
      setLoading(true);
      const data = await notificationApi.getMyNotifications();
      const list = data?.items || [];
      setItems(list);
    } finally {
      setLoading(false);
    }
  }, [user]);

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
    const init = async () => {
      await load();
    };
    if (user) init();
    const id = setInterval(() => {
      if (active) load();
    }, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [user, load]);

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


