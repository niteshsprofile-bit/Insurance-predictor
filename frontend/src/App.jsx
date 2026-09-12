import React, { useState, useEffect } from 'react';
import { authAPI, predictionAPI } from './api';
import Login from './components/Login';
import Register from './components/Register';
import Hero from './components/Hero';
import MultiStepForm from './components/MultiStepForm';
import EstimateView from './components/EstimateView';
import History from './components/History';
import './styles/App.css';

const App = () => {
  const [page, setPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [error, setError] = useState(null);

  // Check if user is already logged in when app loads
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const response = await authAPI.verify();
        setUser(response.data);
        setIsAuthenticated(true);
        setPage('home');
      } catch (err) {
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        setPage('login');
      }
    } else {
      setIsAuthenticated(false);
      setPage('login');
    }
    setLoading(false);
  };

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('auth_token', userData.token);
    setUser({
      user_id: userData.user_id,
      email: userData.email,
      full_name: userData.full_name,
    });
    setIsAuthenticated(true);
    setPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
    setResult(null);
    setPage('login');
  };

  const handleFormSubmit = async (formData) => {
    setError(null);
    try {
      const response = await predictionAPI.predict(formData);
      setResult(response.data);
      setBmi(response.data.bmi);
      setPage('result');
    } catch (err) {
      setError('Error predicting: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Top Navigation Bar (only when logged in) */}
      {isAuthenticated && (
        <nav className="top-nav">
          <div className="nav-content">
            <span className="nav-welcome">Welcome, {user?.full_name}!</span>
            <div className="nav-buttons">
              <button
                onClick={() => setPage('history')}
                className="nav-btn"
              >
                📊 History
              </button>
              <button
                onClick={handleLogout}
                className="nav-btn logout"
              >
                Sign Out
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Authentication Pages */}
      {page === 'login' && (
        <Login
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setPage('register')}
        />
      )}

      {page === 'register' && (
        <Register
          onSuccess={handleLoginSuccess}
          onSwitchToLogin={() => setPage('login')}
        />
      )}

      {/* Main App Pages (only accessible when authenticated) */}
      {isAuthenticated && (
        <>
          {page === 'home' && (
            <Hero onGetQuote={() => setPage('form')} />
          )}

          {page === 'form' && (
            <div className="page-wrapper">
              <div className="back-link" onClick={() => setPage('home')}>
                ← Back to Home
              </div>
              <MultiStepForm
                onSubmit={handleFormSubmit}
                error={error}
              />
            </div>
          )}

          {page === 'result' && result && (
            <div className="page-wrapper">
              <div className="back-link" onClick={() => setPage('home')}>
                ← Back to Home
              </div>
              <EstimateView
                estimate={result}
                bmi={bmi}
                onNewQuote={() => {
                  setPage('form');
                  setResult(null);
                  setError(null);
                }}
              />
            </div>
          )}

          {page === 'history' && (
            <div className="page-wrapper">
              <div className="back-link" onClick={() => setPage('home')}>
                ← Back to Home
              </div>
              <History />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
