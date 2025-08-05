import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered';
  timestamp: Date;
  deliveryAddress: string;
  paymentMethod: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  placeOrder: (deliveryAddress: string, paymentMethod: string) => string;
  orders: Order[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('xp-food-cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }

    // Load orders from localStorage
    const savedOrders = localStorage.getItem('xp-food-orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders).map((order: any) => ({
        ...order,
        timestamp: new Date(order.timestamp)
      })));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('xp-food-cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    // Save orders to localStorage
    localStorage.setItem('xp-food-orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === newItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const placeOrder = (deliveryAddress: string, paymentMethod: string): string => {
    const orderId = Date.now().toString();
    const newOrder: Order = {
      id: orderId,
      items: [...items],
      total: total,
      status: 'pending',
      timestamp: new Date(),
      deliveryAddress,
      paymentMethod,
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return orderId;
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount,
      placeOrder,
      orders,
    }}>
      {children}
    </CartContext.Provider>
  );
};