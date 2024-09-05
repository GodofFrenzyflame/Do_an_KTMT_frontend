import React from 'react';
import './LoadingSpinner.css'; // Import file CSS chứa cài đặt cho spinner

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
