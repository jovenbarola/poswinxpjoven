import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWindows } from '../../contexts/WindowContext';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import WindowManager from './WindowManager';
import DesktopIcons from './DesktopIcons';
import NotificationCenter from './NotificationCenter';
import LoginWindow from '../Auth/LoginWindow';
import RegisterWindow from '../Auth/RegisterWindow';

const Desktop: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { openWindow } = useWindows();
  const [showStartMenu, setShowStartMenu] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      // Show login window by default
      openWindow({
        id: 'login',
        title: 'User Login',
        component: <LoginWindow />,
        size: { width: 400, height: 300 },
      });
    }
  }, [isAuthenticated, openWindow]);

  const handleStartMenuToggle = () => {
    setShowStartMenu(!showStartMenu);
  };

  const handleDesktopClick = () => {
    setShowStartMenu(false);
  };

  return (
    <div className="xp-desktop" onClick={handleDesktopClick}>
      <DesktopIcons />
      <WindowManager />
      <NotificationCenter />
      <Taskbar 
        onStartMenuToggle={handleStartMenuToggle}
        showStartMenu={showStartMenu}
      />
      {showStartMenu && (
        <StartMenu 
          onClose={() => setShowStartMenu(false)}
          onItemClick={() => setShowStartMenu(false)}
        />
      )}
    </div>
  );
};

export default Desktop;