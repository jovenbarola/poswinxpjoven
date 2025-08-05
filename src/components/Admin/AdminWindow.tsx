import React, { useState, useEffect } from 'react';
import { MenuItem, getMenuItems, saveMenuItems } from '../../data/menuData';
import { useNotifications } from '../../contexts/NotificationContext';

const AdminWindow: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'appetizers',
    image: '',
  });

  useEffect(() => {
    setMenuItems(getMenuItems());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'appetizers',
      image: '',
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price) {
      addNotification({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please fill in all required fields.',
      });
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      addNotification({
        type: 'warning',
        title: 'Invalid Price',
        message: 'Please enter a valid price.',
      });
      return;
    }

    if (editingItem) {
      // Update existing item
      const updatedItems = menuItems.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData, price }
          : item
      );
      setMenuItems(updatedItems);
      saveMenuItems(updatedItems);
      
      addNotification({
        type: 'success',
        title: 'Item Updated',
        message: `${formData.name} has been updated successfully.`,
      });
    } else {
      // Add new item
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...formData,
        price,
      };
      const updatedItems = [...menuItems, newItem];
      setMenuItems(updatedItems);
      saveMenuItems(updatedItems);
      
      addNotification({
        type: 'success',
        title: 'Item Added',
        message: `${formData.name} has been added to the menu.`,
      });
    }

    resetForm();
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image || '',
    });
    setShowAddForm(true);
  };

  const handleDelete = (item: MenuItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      const updatedItems = menuItems.filter(i => i.id !== item.id);
      setMenuItems(updatedItems);
      saveMenuItems(updatedItems);
      
      addNotification({
        type: 'info',
        title: 'Item Deleted',
        message: `${item.name} has been removed from the menu.`,
      });
    }
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
          Menu Management ({menuItems.length} items)
        </div>
        <button 
          className="xp-button primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '10px' }}>
        {/* Add/Edit Form */}
        {showAddForm && (
          <div style={{ 
            border: '2px outset #d4d0c8',
            borderRadius: '6px',
            padding: '15px',
            marginBottom: '20px',
            background: '#f9f9f9'
          }}>
            <h3 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '15px', color: '#0054e3' }}>
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="xp-form-group">
                  <label className="xp-label">Name *:</label>
                  <input
                    type="text"
                    name="name"
                    className="xp-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="xp-form-group">
                  <label className="xp-label">Price *:</label>
                  <input
                    type="number"
                    name="price"
                    className="xp-input"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div className="xp-form-group">
                  <label className="xp-label">Category *:</label>
                  <select
                    name="category"
                    className="xp-input"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="appetizers">Appetizers</option>
                    <option value="main-courses">Main Courses</option>
                    <option value="beverages">Beverages</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>
                
                <div className="xp-form-group">
                  <label className="xp-label">Image URL:</label>
                  <input
                    type="url"
                    name="image"
                    className="xp-input"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div className="xp-form-group">
                <label className="xp-label">Description *:</label>
                <textarea
                  name="description"
                  className="xp-input"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
                <button type="button" className="xp-button" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="xp-button primary">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Menu Items List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
          {menuItems.map((item) => (
            <div key={item.id} style={{ 
              border: '2px outset #d4d0c8',
              borderRadius: '6px',
              padding: '10px',
              background: '#f9f9f9'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.name}</div>
                  <div style={{ fontSize: '10px', color: '#666', textTransform: 'capitalize' }}>
                    {item.category.replace('-', ' ')}
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0054e3' }}>
                  ${item.price.toFixed(2)}
                </div>
              </div>
              
              <div style={{ fontSize: '10px', color: '#666', marginBottom: '10px', lineHeight: '1.3' }}>
                {item.description}
              </div>
              
              {item.image && (
                <div style={{ 
                  width: '100%', 
                  height: '80px', 
                  background: '#f0f0f0',
                  border: '1px inset #d4d0c8',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                <button 
                  className="xp-button"
                  onClick={() => handleEdit(item)}
                  style={{ fontSize: '10px', padding: '4px 8px' }}
                >
                  Edit
                </button>
                <button 
                  className="xp-button"
                  onClick={() => handleDelete(item)}
                  style={{ fontSize: '10px', padding: '4px 8px', background: '#ff6b6b', color: 'white' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {menuItems.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666',
            fontSize: '12px' 
          }}>
            No menu items found.<br />
            Add your first item to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWindow;