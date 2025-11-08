import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { useNotifications } from '../../context/NotificationContext';
import NotificationBadge from './NotificationBadge';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'message':
        navigate('/messages');
        break;
      case 'course':
        navigate(`/courses/${notification.relatedId}`);
        break;
      case 'assignment':
        navigate(`/assignments/${notification.relatedId}`);
        break;
      case 'grade':
        navigate(`/grades`);
        break;
      default:
        // Generic notification just marks as read
        break;
    }
  };

  const notificationMenu = (
    <Menu
      items={[
        {
          key: 'header',
          label: (
            <div className="flex justify-between items-center p-2">
              <span className="font-medium">Notifications</span>
              <Button
                type="text"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
              >
                Mark all as read
              </Button>
            </div>
          )
        },
        ...notifications.map((notification) => ({
          key: notification.id,
          label: (
            <div
              onClick={() => handleNotificationClick(notification)}
              className={`p-3 cursor-pointer hover:bg-gray-50 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.createdAt?.toDate()).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </div>
            </div>
          )
        })),
        {
          key: 'footer',
          label: (
            <div
              className="text-center p-2 text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => navigate('/notifications')}
            >
              See all notifications
            </div>
          )
        }
      ]}
    />
  );

  return (
    <Dropdown
      overlay={notificationMenu}
      trigger={['click']}
      placement="bottomRight"
      overlayStyle={{ maxHeight: '80vh', overflow: 'auto' }}
    >
      <div className="cursor-pointer">
        <NotificationBadge />
      </div>
    </Dropdown>
  );
};

export default NotificationDropdown;