import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationCenter: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="xp-notification"
          style={{
            bottom: 40 + (index * 80),
            animation: 'slideIn 0.3s ease-out'
          }}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="xp-notification-header">
            {notification.title}
          </div>
          <div className="xp-notification-content">
            {notification.message}
          </div>
        </div>
      ))}
    </>
  );
};

export default NotificationCenter;