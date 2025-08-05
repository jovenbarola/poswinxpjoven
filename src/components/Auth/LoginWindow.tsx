import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWindows } from '../../contexts/WindowContext';
import { useNotifications } from '../../contexts/NotificationContext';
import RegisterWindow from './RegisterWindow';

const LoginWindow: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { closeWindow, openWindow } = useWindows();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addNotification({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter both email and password.',
      });
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      addNotification({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome to the Food Ordering System!',
      });
      closeWindow('login');
    } else {
      addNotification({
        type: 'error',
        title: 'Login Failed',
        message: 'Invalid email/username or password.',
      });
    }
  };

  const handleRegisterClick = () => {
    closeWindow('login');
    openWindow({
      id: 'register',
      title: 'Create Account',
      component: <RegisterWindow />,
      size: { width: 400, height: 400 },
    });
  };

  return (
    <div className="xp-form">
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>User Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="xp-form-group">
          <label className="xp-label">Email or Username:</label>
          <input
            type="text"
            className="xp-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email or username"
            disabled={isLoading}
          />
        </div>
        <div className="xp-form-group">
          <label className="xp-label">Password:</label>
          <input
            type="password"
            className="xp-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            disabled={isLoading}
          />
        </div>
        <div className="xp-form-group" style={{ textAlign: 'center', gap: '10px', display: 'flex', justifyContent: 'center' }}>
          <button 
            type="submit" 
            className="xp-button primary"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <button 
            type="button" 
            className="xp-button"
            onClick={handleRegisterClick}
            disabled={isLoading}
          >
            Register
          </button>
        </div>
      </form>
      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', border: '1px inset #d4d0c8', fontSize: '10px' }}>
        <strong>Demo Accounts:</strong><br />
        Admin: admin@foodapp.com / admin123<br />
        User: demo@user.com / demo123
      </div>
    </div>
  );
};

export default LoginWindow;