import React from 'react';

const ResultDisplay = ({ result, onReset }) => {
  const { predicted_charges, bmi } = result;

  let riskLevel = 'Low Risk';
  let riskColor = '#28a745';

  if (predicted_charges > 50000) {
    riskLevel = 'High Risk';
    riskColor = '#dc3545';
  } else if (predicted_charges > 20000) {
    riskLevel = 'Moderate Risk';
    riskColor = '#ffc107';
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(predicted_charges);

  return (
    <div className="result-container">
      <div className="result-card">
        <h2>Your Insurance Quote</h2>

        <div className="quote-display">
          <div className="quote-amount">
            <span className="currency-symbol">₹</span>
            <span className="amount">
              {Math.round(predicted_charges)}
            </span>
            <span className="period">/ year</span>
          </div>
          <p className="quote-subtext">Approximate annual premium: {formatted}</p>
        </div>

        <div className="risk-assessment">
          <h3>Health Risk Assessment</h3>
          <div className="risk-badge" style={{ backgroundColor: riskColor }}>
            {riskLevel}
          </div>
        </div>

        <div className="metrics-summary">
          <h3>Your Health Metrics</h3>
          <div className="metric">
            <span className="metric-label">BMI</span>
            <span className="metric-value">{bmi}</span>
            <span className="metric-status">
              {bmi < 18.5 && 'Underweight'}
              {bmi >= 18.5 && bmi < 25 && 'Normal'}
              {bmi >= 25 && bmi < 30 && 'Overweight'}
              {bmi >= 30 && 'Obese'}
            </span>
          </div>
        </div>

        <div className="recommendations">
          <h3>Recommendations</h3>
          <ul>
            {predicted_charges > 50000 && (
              <>
                <li>Consider regular comprehensive health check-ups.</li>
                <li>Discuss preventive care strategies with a doctor.</li>
                <li>Focus strongly on lifestyle changes to reduce risk.</li>
              </>
            )}
            {predicted_charges > 20000 && predicted_charges <= 50000 && (
              <>
                <li>Improve daily activity levels and diet quality.</li>
                <li>Monitor blood pressure and sugar at regular intervals.</li>
                <li>Avoid smoking and manage stress where possible.</li>
              </>
            )}
            {predicted_charges <= 20000 && (
              <>
                <li>Maintain your current healthy habits consistently.</li>
                <li>Schedule periodic check-ups to track key metrics.</li>
                <li>Stay active and keep monitoring your lifestyle choices.</li>
              </>
            )}
          </ul>
        </div>

        <div className="action-buttons">
          <button onClick={onReset} className="new-quote-btn">
            Get Another Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
