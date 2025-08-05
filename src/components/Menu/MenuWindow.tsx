import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { MenuItem, getMenuItems } from '../../data/menuData';

const MenuWindow: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const { addNotification } = useNotifications();

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'appetizers', name: 'Appetizers' },
    { id: 'main-courses', name: 'Main Courses' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'desserts', name: 'Desserts' },
  ];

  useEffect(() => {
    const items = getMenuItems();
    setMenuItems(items);
    setFilteredItems(items);
  }, []);

  useEffect(() => {
    let filtered = menuItems;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [menuItems, selectedCategory, searchTerm]);

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });

    addNotification({
      type: 'success',
      title: 'Item Added',
      message: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header Controls */}
      <div style={{ padding: '10px', borderBottom: '1px solid #d4d0c8', background: '#f4f3ee' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
          <label className="xp-label">Category:</label>
          <select 
            className="xp-input" 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: '150px' }}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <label className="xp-label" style={{ marginLeft: '20px' }}>Search:</label>
          <input
            type="text"
            className="xp-input"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '200px' }}
          />
        </div>
        <div style={{ fontSize: '11px', color: '#666' }}>
          Showing {filteredItems.length} of {menuItems.length} items
        </div>
      </div>

      {/* Menu Items Grid */}
      <div style={{ flex: 1, overflow: 'auto', padding: '10px' }}>
        <div className="xp-menu-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="xp-menu-item">
              <div className="xp-menu-item-image">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </div>
              <div className="xp-menu-item-name">{item.name}</div>
              <div className="xp-menu-item-description">{item.description}</div>
              <div className="xp-menu-item-price">${item.price.toFixed(2)}</div>
              <button 
                className="xp-button primary"
                onClick={() => handleAddToCart(item)}
                style={{ width: '100%' }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666',
            fontSize: '12px' 
          }}>
            No items found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuWindow;