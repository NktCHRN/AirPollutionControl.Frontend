import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css'; // Assuming styles are in App.css

const Login = ({ setIsLoggedIn }) => {
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://localhost:7286/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (data.isSuccessful) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        alert('Login successful!');
        setIsLoggedIn(true);
        // Redirect to the home page or dashboard
        navigate('/'); // Redirect to home page
      } else {
        setError(data.error.errorMessage);
      }
    } catch {
      setError('Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-header">Login</h2>
      <div className="form-container">
        <input
          type="text"
          className="form-input"
          placeholder="Login"
          value={loginData.login}
          onChange={(e) => setLoginData({ ...loginData, login: e.target.value })}
        />
        <input
          type="password"
          className="form-input"
          placeholder="Password"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
        />
        <button className="btn" onClick={handleLogin} disabled={loading}>
          Login
        </button>
        {error && <p className="error-text">{error}</p>}
      </div>
      <p>
        No account?{' '}
        <Link to="/registration" className="link-text">Register</Link>
      </p>
    </div>
  );
};

export default Login;
