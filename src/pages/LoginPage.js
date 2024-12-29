import React, { useState } from 'react';
import axios from 'axios';
import '../Auth.css'; // Use your CSS file for styling

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!loginData.email || !loginData.password) {
      setLoginError('Both email and password are required.');
      return;
    }
  
    try {
      setLoginLoading(true);
      setLoginError('');
  
      const response = await axios.post('http://localhost:7000/api/auth/v1/login', loginData);
  
      if (response.status === 200 && response.data.success) {
        const { token, user } = response.data;
  
        // Store token and user details in localStorage
        localStorage.setItem('user', JSON.stringify(user)); // Store user as JSON string
        localStorage.setItem('authToken', token);
        localStorage.setItem('role', user.role); // Store role
        if (user.role === 'doctor') {
          localStorage.setItem('specialist', user.specialist);
          localStorage.setItem('registrationNo', user.registrationNo);
        }
  
        alert(`Login successful! Welcome ${user.name}`);
  
        // Redirect based on role
        if (user.role === 'doctor') {
          window.location.href = '/';
        } else {
          window.location.href = '/';
        }
      } else {
        setLoginError(response.data.message || 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred. Please try again later.');
    } finally {
      setLoginLoading(false);
    }
  };
  

  return (
    <div className="login-page-container">
      <h2>Login</h2>
      {loginError && <p className="login-error-message">{loginError}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-form-group">
          <label htmlFor="login-email">Email Address</label>
          <input
            type="email"
            id="login-email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="login-form-group">
          <label htmlFor="login-password">Password</label>
          <input
            type="password"
            id="login-password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-submit-btn" disabled={loginLoading}>
          {loginLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
