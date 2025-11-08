import React from 'react';
import { Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNotifications } from '../../context/NotificationContext';

const NotificationBadge = () => {
  const { unreadCount } = useNotifications();

  return (
    <Badge count={unreadCount} offset={[-5, 5]}>
      <BellOutlined className="text-xl" />
    </Badge>
  );
};

export default NotificationBadge;