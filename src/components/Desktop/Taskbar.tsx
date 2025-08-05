import React, { useState, useEffect } from 'react';
import { useWindows } from '../../contexts/WindowContext';
import { useCart } from '../../contexts/CartContext';

interface TaskbarProps {
  onStartMenuToggle: () => void;
  showStartMenu: boolean;
}

const Taskbar: React.FC<TaskbarProps> = ({ onStartMenuToggle, showStartMenu }) => {
  const { windows, activeWindow, setActiveWindow, minimizeWindow } = useWindows();
  const { itemCount } = useCart();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTaskbarButtonClick = (windowId: string) => {
    const window = windows.find(w => w.id === windowId);
    if (!window) return;

    if (window.isMinimized || activeWindow !== windowId) {
      setActiveWindow(windowId);
    } else {
      minimizeWindow(windowId);
    }
  };

  return (
    <div className="xp-taskbar">
      <button
        className={`xp-start-button ${showStartMenu ? 'active' : ''}`}
        onClick={onStartMenuToggle}
      >
        start
      </button>

      <div className="xp-taskbar-buttons">
        {windows.map((window) => (
          <button
            key={window.id}
            className={`xp-taskbar-button ${activeWindow === window.id && !window.isMinimized ? 'active' : ''}`}
            onClick={() => handleTaskbarButtonClick(window.id)}
          >
            {window.title}
            {window.id === 'cart' && itemCount > 0 && (
              <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>
                ({itemCount})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="xp-system-tray">
        <div className="xp-clock">
          {currentTime.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </div>
      </div>
    </div>
  );
};

export default Taskbar;