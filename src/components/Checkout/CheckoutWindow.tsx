import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useWindows } from '../../contexts/WindowContext';
import { useNotifications } from '../../contexts/NotificationContext';

const CheckoutWindow: React.FC = () => {
  const { items, total, placeOrder } = useCart();
  const { closeWindow, openWindow } = useWindows();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    deliveryAddress: '',
    paymentMethod: 'credit-card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const tax = total * 0.085;
  const finalTotal = total + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.deliveryAddress.trim()) {
      addNotification({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter a delivery address.',
      });
      return false;
    }

    if (formData.paymentMethod === 'credit-card') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        addNotification({
          type: 'warning',
          title: 'Missing Payment Info',
          message: 'Please fill in all credit card details.',
        });
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderId = placeOrder(formData.deliveryAddress, formData.paymentMethod);

    setIsProcessing(false);

    addNotification({
      type: 'success',
      title: 'Order Placed Successfully!',
      message: `Order #${orderId} has been confirmed. Estimated delivery: 30-45 minutes.`,
    });

    closeWindow('checkout');
    closeWindow('cart');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ 
        padding: '10px', 
        borderBottom: '1px solid #d4d0c8', 
        background: '#f4f3ee',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        Review Order & Checkout
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '15px' }}>
        {/* Order Summary */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', color: '#0054e3' }}>
            Order Summary
          </h3>
          <div style={{ 
            border: '1px inset #d4d0c8', 
            padding: '10px', 
            background: '#f9f9f9',
            maxHeight: '120px',
            overflow: 'auto'
          }}>
            {items.map((item) => (
              <div key={item.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '11px',
                marginBottom: '5px'
              }}>
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr style={{ margin: '8px 0', border: '1px inset #d4d0c8' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span>Tax (8.5%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '12px', 
              fontWeight: 'bold',
              marginTop: '5px',
              paddingTop: '5px',
              borderTop: '1px solid #ccc'
            }}>
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', color: '#0054e3' }}>
            Delivery Information
          </h3>
          <div className="xp-form-group">
            <label className="xp-label">Delivery Address:</label>
            <textarea
              name="deliveryAddress"
              className="xp-input"
              value={formData.deliveryAddress}
              onChange={handleInputChange}
              placeholder="Enter your full delivery address..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Payment Information */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', color: '#0054e3' }}>
            Payment Method
          </h3>
          <div className="xp-form-group">
            <select
              name="paymentMethod"
              className="xp-input"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="credit-card">Credit Card</option>
              <option value="cash">Cash on Delivery</option>
            </select>
          </div>

          {formData.paymentMethod === 'credit-card' && (
            <>
              <div className="xp-form-group">
                <label className="xp-label">Card Number:</label>
                <input
                  type="text"
                  name="cardNumber"
                  className="xp-input"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="xp-form-group" style={{ flex: 1 }}>
                  <label className="xp-label">Expiry Date:</label>
                  <input
                    type="text"
                    name="expiryDate"
                    className="xp-input"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="xp-form-group" style={{ flex: 1 }}>
                  <label className="xp-label">CVV:</label>
                  <input
                    type="text"
                    name="cvv"
                    className="xp-input"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        padding: '15px', 
        borderTop: '1px solid #d4d0c8', 
        background: '#f4f3ee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
          Total: ${finalTotal.toFixed(2)}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="xp-button"
            onClick={() => closeWindow('checkout')}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button 
            className="xp-button primary"
            onClick={handlePlaceOrder}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutWindow;