import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWindows } from '../../contexts/WindowContext';
import MenuWindow from '../Menu/MenuWindow';
import CartWindow from '../Cart/CartWindow';

const DesktopIcons: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { openWindow } = useWindows();

  const handleIconDoubleClick = (iconType: string) => {
    switch (iconType) {
      case 'menu':
        openWindow({
          id: 'menu',
          title: 'Food & Beverage Menu',
          component: <MenuWindow />,
          size: { width: 800, height: 600 },
        });
        break;
      case 'cart':
        openWindow({
          id: 'cart',
          title: 'Shopping Cart',
          component: <CartWindow />,
          size: { width: 500, height: 400 },
        });
        break;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="xp-desktop-icons">
      <div 
        className="xp-desktop-icon"
        onDoubleClick={() => handleIconDoubleClick('menu')}
      >
        <div className="xp-desktop-icon-image">🍽️</div>
        <div className="xp-desktop-icon-label">Menu</div>
      </div>
      <div 
        className="xp-desktop-icon"
        onDoubleClick={() => handleIconDoubleClick('cart')}
      >
        <div className="xp-desktop-icon-image">🛒</div>
        <div className="xp-desktop-icon-label">Cart</div>
      </div>
    </div>
  );
};

export default DesktopIcons;