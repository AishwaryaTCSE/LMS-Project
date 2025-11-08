import React from 'react';
import { FiBell, FiMail } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';
import { Badge, Avatar, Menu, Dropdown } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ user, title }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  
  const notificationItems = notifications.map(notification => ({
    key: notification.id,
    label: (
      <div 
        onClick={() => {
          markAsRead(notification.id);
          if (notification.type === 'message') {
            navigate('/messages');
          }
        }}
        className={`p-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
      >
        <p className="text-sm font-medium">{notification.message}</p>
        <p className="text-xs text-gray-500">
          {new Date(notification.createdAt?.toDate()).toLocaleString()}
        </p>
      </div>
    )
  }));

  const notificationMenu = (
    <Menu
      items={[
        {
          key: 'header',
          label: (
            <div className="flex justify-between items-center p-2">
              <span className="font-medium">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
          ),
          disabled: true
        },
        ...notificationItems,
        {
          key: 'footer',
          label: (
            <div 
              className="text-center p-2 text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => navigate('/notifications')}
            >
              View All
            </div>
          )
        }
      ]}
      style={{ maxHeight: '400px', overflow: 'auto' }}
    />
  );

  return (
    <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Dropdown 
          overlay={notificationMenu} 
          trigger={['click']} 
          placement="bottomRight"
        >
          <div className="cursor-pointer">
            <Badge count={unreadCount}>
              <FiBell className="text-xl text-gray-600" />
            </Badge>
          </div>
        </Dropdown>
        
        <div className="flex items-center space-x-3">
          <Avatar src={user?.photoURL} alt={user?.displayName}>
            {user?.displayName?.charAt(0)}
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.displayName}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;