import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWindows } from '../../contexts/WindowContext';
import MenuWindow from '../Menu/MenuWindow';
import CartWindow from '../Cart/CartWindow';
import OrderHistoryWindow from '../Orders/OrderHistoryWindow';
import AdminWindow from '../Admin/AdminWindow';
import RegisterWindow from '../Auth/RegisterWindow';

interface StartMenuProps {
  onClose: () => void;
  onItemClick: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onClose, onItemClick }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { openWindow } = useWindows();

  const handleMenuItemClick = (action: string) => {
    onItemClick();
    
    switch (action) {
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
      case 'orders':
        openWindow({
          id: 'orders',
          title: 'Order History',
          component: <OrderHistoryWindow />,
          size: { width: 700, height: 500 },
        });
        break;
      case 'admin':
        if (user?.isAdmin) {
          openWindow({
            id: 'admin',
            title: 'Admin Panel',
            component: <AdminWindow />,
            size: { width: 900, height: 700 },
          });
        }
        break;
      case 'register':
        openWindow({
          id: 'register',
          title: 'Create Account',
          component: <RegisterWindow />,
          size: { width: 400, height: 400 },
        });
        break;
      case 'logout':
        logout();
        break;
    }
  };

  return (
    <div className="xp-start-menu">
      <div className="xp-start-menu-header">
        {isAuthenticated ? `Welcome, ${user?.username}` : 'Food Ordering System'}
      </div>
      <div className="xp-start-menu-items">
        {isAuthenticated ? (
          <>
            <div 
              className="xp-start-menu-item"
              onClick={() => handleMenuItemClick('menu')}
            >
              <div className="xp-start-menu-icon"></div>
              Browse Menu
            </div>
            <div 
              className="xp-start-menu-item"
              onClick={() => handleMenuItemClick('cart')}
            >
              <div className="xp-start-menu-icon"></div>
              Shopping Cart
            </div>
            <div 
              className="xp-start-menu-item"
              onClick={() => handleMenuItemClick('orders')}
            >
              <div className="xp-start-menu-icon"></div>
              Order History
            </div>
            {user?.isAdmin && (
              <div 
                className="xp-start-menu-item"
                onClick={() => handleMenuItemClick('admin')}
              >
                <div className="xp-start-menu-icon"></div>
                Admin Panel
              </div>
            )}
            <hr style={{ margin: '5px 0', border: '1px inset #d4d0c8' }} />
            <div 
              className="xp-start-menu-item"
              onClick={() => handleMenuItemClick('logout')}
            >
              <div className="xp-start-menu-icon"></div>
              Logout
            </div>
          </>
        ) : (
          <>
            <div 
              className="xp-start-menu-item"
              onClick={() => handleMenuItemClick('register')}
            >
              <div className="xp-start-menu-icon"></div>
              Create Account
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StartMenu;