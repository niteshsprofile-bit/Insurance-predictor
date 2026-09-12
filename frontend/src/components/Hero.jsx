import React, { useState } from 'react';

const Hero = ({ onGetQuote }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="hero-root">
      <header className="hero-header">
        <div className="hero-badge">
          <span className="badge-dot" /> AI‑Powered Health Analysis
        </div>
      </header>

      <main className="hero-main">
        <section className="hero-left">
          <h1 className="hero-title">
            Your Health,<br />
            <span>Your Insurance</span>
          </h1>
          <p className="hero-subtitle">
            Get instant, personalized medical insurance estimates based on your unique
            health profile. Make confident decisions with transparent, data‑driven
            predictions.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={onGetQuote}>
              Get Your Quote
            </button>

            <button
              className="btn-ghost"
              type="button"
              onClick={() => setShowMore((s) => !s)}
            >
              Learn More
            </button>
          </div>

          {showMore && (
            <div className="learn-more-card">
              <h3>Why medical insurance matters</h3>
              <p>
                A single unexpected hospital visit can cost more than a year of salary.
                With the right cover, that bill is handled by your insurer instead of
                your savings.
              </p>
              <p className="learn-more-example">
                Example: A 3‑day ICU stay for pneumonia can easily cross ₹2–3 lakh.
                With insurance, your out‑of‑pocket cost can drop to almost zero, while
                you focus on recovery instead of worrying about money.
              </p>
              <p>
                Use this tool to understand how your lifestyle, health metrics and
                medical history influence your premium, so you can plan early and stay
                financially protected.
              </p>
            </div>
          )}

          <div className="hero-tags">
            <div className="tag-item">
              <span className="tag-icon shield" /> Secure
              <span className="tag-text">Your data stays on your device during demo use.</span>
            </div>
            <div className="tag-item">
              <span className="tag-icon chart" /> Accurate
              <span className="tag-text">Logic‑based estimates that react to your inputs.</span>
            </div>
            <div className="tag-item">
              <span className="tag-icon lightning" /> Instant
              <span className="tag-text">See your quote in just a few steps.</span>
            </div>
          </div>
        </section>

        <section className="hero-right">
          <div className="quick-card">
            <div className="quick-card-header">
              <h3>Quick Facts</h3>
              <span className="heart-pill">♡</span>
            </div>
            <div className="quick-list">
              <div className="quick-item">
                <div className="quick-dot" />
                <div>
                  <h4>Comprehensive Analysis</h4>
                  <p>10+ health factors considered in every estimate.</p>
                </div>
              </div>
              <div className="quick-item">
                <div className="quick-dot" />
                <div>
                  <h4>Personalized Results</h4>
                  <p>Tailored to your age, BMI, vitals and history.</p>
                </div>
              </div>
              <div className="quick-item">
                <div className="quick-dot" />
                <div>
                  <h4>Instant Estimates</h4>
                  <p>Answer a few questions and get a quote in seconds.</p>
                </div>
              </div>
            </div>
            <div className="trust-text">
              Trusted as a learning tool by aspiring data scientists and developers.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Hero;
