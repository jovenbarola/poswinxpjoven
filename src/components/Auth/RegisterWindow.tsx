import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWindows } from '../../contexts/WindowContext';
import { useNotifications } from '../../contexts/NotificationContext';

const RegisterWindow: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { closeWindow } = useWindows();
  const { addNotification } = useNotifications();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      addNotification({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please fill in all fields.',
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      addNotification({
        type: 'warning',
        title: 'Password Mismatch',
        message: 'Passwords do not match.',
      });
      return false;
    }

    if (formData.password.length < 6) {
      addNotification({
        type: 'warning',
        title: 'Weak Password',
        message: 'Password must be at least 6 characters long.',
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      addNotification({
        type: 'warning',
        title: 'Invalid Email',
        message: 'Please enter a valid email address.',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    const success = await register(formData.username, formData.email, formData.password);
    setIsLoading(false);

    if (success) {
      addNotification({
        type: 'success',
        title: 'Registration Successful',
        message: 'Account created successfully! You are now logged in.',
      });
      closeWindow('register');
    } else {
      addNotification({
        type: 'error',
        title: 'Registration Failed',
        message: 'Username or email already exists.',
      });
    }
  };

  return (
    <div className="xp-form">
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="xp-form-group">
          <label className="xp-label">Username:</label>
          <input
            type="text"
            name="username"
            className="xp-input"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            disabled={isLoading}
          />
        </div>
        <div className="xp-form-group">
          <label className="xp-label">Email:</label>
          <input
            type="email"
            name="email"
            className="xp-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>
        <div className="xp-form-group">
          <label className="xp-label">Password:</label>
          <input
            type="password"
            name="password"
            className="xp-input"
            value={formData.password}
            onChange={handleChange}
            placeholder="Choose a password"
            disabled={isLoading}
          />
        </div>
        <div className="xp-form-group">
          <label className="xp-label">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            className="xp-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            disabled={isLoading}
          />
        </div>
        <div className="xp-form-group" style={{ textAlign: 'center' }}>
          <button 
            type="submit" 
            className="xp-button primary"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterWindow;