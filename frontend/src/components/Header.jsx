import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-icon">🏥</span>
          <h1>Medical Insurance Predictor</h1>
        </div>
        <p className="tagline">
          Estimate your insurance costs based on your health, history and lifestyle.
        </p>
      </div>
    </header>
  );
};

export default Header;
