import React, { useState, useEffect } from 'react';
import { WindowProvider } from './contexts/WindowContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Desktop from './components/Desktop/Desktop';
import './styles/xp-theme.css';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading time for authentic XP experience
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="xp-loading">
        <div className="xp-loading-screen">
          <div className="xp-logo">Windows XP</div>
          <div className="xp-loading-bar">
            <div className="xp-loading-progress"></div>
          </div>
          <div className="xp-loading-text">Starting Food Ordering System...</div>
        </div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <WindowProvider>
            <Desktop />
          </WindowProvider>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;