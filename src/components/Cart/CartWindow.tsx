import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useWindows } from '../../contexts/WindowContext';
import { useNotifications } from '../../contexts/NotificationContext';
import CheckoutWindow from '../Checkout/CheckoutWindow';

const CartWindow: React.FC = () => {
  const { items, updateQuantity, removeFromCart, total, itemCount } = useCart();
  const { openWindow } = useWindows();
  const { addNotification } = useNotifications();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      addNotification({
        type: 'info',
        title: 'Item Removed',
        message: 'Item has been removed from your cart.',
      });
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id);
    addNotification({
      type: 'info',
      title: 'Item Removed',
      message: `${name} has been removed from your cart.`,
    });
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      addNotification({
        type: 'warning',
        title: 'Empty Cart',
        message: 'Your cart is empty. Add some items first.',
      });
      return;
    }

    openWindow({
      id: 'checkout',
      title: 'Checkout',
      component: <CheckoutWindow />,
      size: { width: 600, height: 500 },
    });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ 
        padding: '10px', 
        borderBottom: '1px solid #d4d0c8', 
        background: '#f4f3ee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
          Shopping Cart ({itemCount} items)
        </div>
        <button 
          className="xp-button primary"
          onClick={handleCheckout}
          disabled={items.length === 0}
        >
          Checkout
        </button>
      </div>

      {/* Cart Items */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {items.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666',
            fontSize: '12px' 
          }}>
            Your cart is empty.<br />
            Browse the menu to add items.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="xp-cart-item">
              <div className="xp-cart-item-name">{item.name}</div>
              <div className="xp-cart-quantity">
                <button
                  className="xp-quantity-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  className="xp-quantity-input"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                  min="0"
                />
                <button
                  className="xp-quantity-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                ${item.price.toFixed(2)} each
              </div>
              <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button
                className="xp-button"
                onClick={() => handleRemoveItem(item.id, item.name)}
                style={{ fontSize: '10px', padding: '2px 6px' }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {/* Total */}
      {items.length > 0 && (
        <div className="xp-cart-total">
          Tax (8.5%): ${(total * 0.085).toFixed(2)}<br />
          <strong>Total: ${(total * 1.085).toFixed(2)}</strong>
        </div>
      )}
    </div>
  );
};

export default CartWindow;