import React, { useState, useEffect } from 'react';
import { predictionAPI } from '../api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await predictionAPI.getHistory();
      setHistory(response.data.data);
    } catch (err) {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your history...</div>;
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  if (history.length === 0) {
    return (
      <div className="card-shell">
        <h2>Your Analysis History</h2>
        <p className="empty-state">No predictions yet. Get started by filling the form!</p>
      </div>
    );
  }

  // Prepare data for chart
  const chartData = {
    labels: history.slice(0, 5).map((item, idx) => `Analysis ${idx + 1}`),
    datasets: [
      {
        label: 'Insurance Premium (₹)',
        data: history.slice(0, 5).map((item) => item.predicted_charges),
        backgroundColor: 'rgba(15, 118, 110, 0.7)',
        borderColor: 'rgba(15, 118, 110, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Insurance Premium Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Premium Amount (₹)',
        },
      },
    },
  };

  // Calculate statistics
  const totalPredictions = history.length;
  const avgPremium = Math.round(history.reduce((sum, item) => sum + item.predicted_charges, 0) / history.length);
  const maxPremium = Math.max(...history.map((item) => item.predicted_charges));
  const minPremium = Math.min(...history.map((item) => item.predicted_charges));

  return (
    <div className="card-shell">
      <h1>Your Analysis History</h1>
      <p className="form-subtitle">View your previous insurance estimates and trends</p>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Analyses</span>
          <span className="stat-value">{totalPredictions}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average Premium</span>
          <span className="stat-value">₹{avgPremium.toLocaleString('en-IN')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Highest Premium</span>
          <span className="stat-value">₹{Math.round(maxPremium).toLocaleString('en-IN')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Lowest Premium</span>
          <span className="stat-value">₹{Math.round(minPremium).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Detailed Table */}
      <div className="history-table">
        <h3>Detailed Records</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Age</th>
              <th>BMI</th>
              <th>Region</th>
              <th>Premium (₹)</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                <td>{item.age}</td>
                <td>{item.bmi?.toFixed(1)}</td>
                <td className="capitalize">{item.region}</td>
                <td className="premium">₹{Math.round(item.predicted_charges).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
