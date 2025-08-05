import React from 'react';
import { useCart, Order } from '../../contexts/CartContext';

const OrderHistoryWindow: React.FC = () => {
  const { orders } = useCart();

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '#ff9500';
      case 'confirmed': return '#007aff';
      case 'preparing': return '#ff6b35';
      case 'delivered': return '#28a745';
      default: return '#666';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Order Received';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'delivered': return 'Delivered';
      default: return status;
    }
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
        Order History ({orders.length} orders)
      </div>

      {/* Orders List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '10px' }}>
        {orders.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666',
            fontSize: '12px' 
          }}>
            No orders found.<br />
            Place your first order to see it here.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={{ 
              border: '2px outset #d4d0c8',
              borderRadius: '6px',
              padding: '15px',
              marginBottom: '15px',
              background: '#f9f9f9'
            }}>
              {/* Order Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                paddingBottom: '8px',
                borderBottom: '1px solid #ddd'
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    Order #{order.id}
                  </div>
                  <div style={{ fontSize: '10px', color: '#666' }}>
                    {order.timestamp.toLocaleDateString()} at {order.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <div style={{ 
                  padding: '4px 8px',
                  background: getStatusColor(order.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {getStatusText(order.status)}
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>
                  Items:
                </div>
                {order.items.map((item, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '10px',
                    marginBottom: '3px',
                    paddingLeft: '10px'
                  }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Order Details */}
              <div style={{ fontSize: '10px', color: '#666', marginBottom: '8px' }}>
                <div><strong>Delivery:</strong> {order.deliveryAddress}</div>
                <div><strong>Payment:</strong> {order.paymentMethod === 'credit-card' ? 'Credit Card' : 'Cash on Delivery'}</div>
              </div>

              {/* Order Total */}
              <div style={{ 
                textAlign: 'right',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#0054e3',
                paddingTop: '8px',
                borderTop: '1px solid #ddd'
              }}>
                Total: ${order.total.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistoryWindow;