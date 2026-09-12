import React from 'react';

const EstimateView = ({ estimate, bmi, onNewQuote }) => {
  const amount = estimate?.predicted_charges || 0;
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);

  let riskLevel = 'Low';
  let riskColor = '#16a34a';
  if (amount > 50000) {
    riskLevel = 'High';
    riskColor = '#dc2626';
  } else if (amount > 25000) {
    riskLevel = 'Moderate';
    riskColor = '#f97316';
  }

  return (
    <div className="estimate-page">
      <div className="status-pill">✓ Analysis Complete</div>

      <h1 className="estimate-title">Your Insurance Estimate</h1>
      <p className="estimate-subtitle">
        Based on your health profile and lifestyle factors.
      </p>

      <section className="estimate-highlight">
        <div className="highlight-top">
          <h2>Estimated Annual Premium</h2>
          <div className="amount-row">
            <span className="currency-symbol">₹</span>
            <span className="amount-main">{Math.round(amount)}</span>
            <span className="amount-period">/ year</span>
          </div>
          <p className="highlight-text">
            This is a representative estimate generated from the information you
            provided. Actual premiums may vary based on additional factors and
            insurance provider policies.
          </p>
        </div>
        <div className="highlight-bottom">
          <div className="highlight-tile">
            <span className="tile-label">Monthly Approx.</span>
            <span className="tile-value">
              ₹{Math.round(amount / 12).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="highlight-tile">
            <span className="tile-label">Cover Type</span>
            <span className="tile-value">Comprehensive</span>
          </div>
        </div>
      </section>

      <section className="risk-section">
        <div className="risk-card">
          <h3>BMI Status</h3>
          <div className="metric-main">
            <span className="metric-number">{bmi}</span>
            <span className="metric-badge">
              {bmi < 18.5 && 'Underweight'}
              {bmi >= 18.5 && bmi < 25 && 'Normal'}
              {bmi >= 25 && bmi < 30 && 'Overweight'}
              {bmi >= 30 && 'Obese'}
            </span>
          </div>
          <p className="metric-note">
            Maintaining a healthy BMI can reduce long‑term health risks and
            insurance costs.
          </p>
        </div>

        <div className="risk-card">
          <h3>Risk Level</h3>
          <div className="metric-main">
            <span
              className="metric-badge large"
              style={{ backgroundColor: riskColor }}
            >
              {riskLevel} Risk
            </span>
          </div>
          <p className="metric-note">
            Higher predicted premiums generally indicate a higher health risk
            profile. Small lifestyle changes can significantly improve this over
            time.
          </p>
        </div>
      </section>

      <section className="recommendations-block">
        <h2>Personalized Recommendations</h2>
        <div className="rec-list">
          <div className="rec-item">
            <span className="rec-icon green">✓</span>
            <div>
              <h4>Regular Health Checkups</h4>
              <p>
                Schedule annual checkups to keep track of blood pressure, sugar
                levels and overall health trends.
              </p>
            </div>
          </div>
          <div className="rec-item">
            <span className="rec-icon blue">✓</span>
            <div>
              <h4>Maintain a Healthy BMI</h4>
              <p>
                Balanced diet and 30 minutes of daily activity can keep your BMI
                within a comfortable range.
              </p>
            </div>
          </div>
          <div className="rec-item">
            <span className="rec-icon orange">✓</span>
            <div>
              <h4>Monitor Blood Pressure & Sugar</h4>
              <p>
                Early control of hypertension and diabetes helps avoid costly
                hospitalizations later.
              </p>
            </div>
          </div>
          <div className="rec-item">
            <span className="rec-icon red">✕</span>
            <div>
              <h4>Avoid Smoking</h4>
              <p>
                Smoking raises both health risks and premiums sharply. Quitting
                can meaningfully lower your estimate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="next-steps">
        <h2>What&apos;s Next?</h2>
        <ul>
          <li>Use this estimate to discuss coverage options with providers.</li>
          <li>Compare plans using similar coverage and premium ranges.</li>
          <li>Re‑run this tool after lifestyle improvements to track progress.</li>
        </ul>
        <button className="btn-primary wide" onClick={onNewQuote}>
          Get Another Quote
        </button>
      </section>
    </div>
  );
};

export default EstimateView;
