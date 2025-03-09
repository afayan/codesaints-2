import React from "react";

const CircleChart = ({ percentage }) => {
  const radius = 50; // Radius of the circle
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width="150" height="150" viewBox="0 0 120 120">
      {/* Background Circle */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#e0e0e0"
        strokeWidth={strokeWidth}
      />
      
      {/* Progress Circle */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="blue"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
      />

      {/* Percentage Text */}
      <text x="50%" y="50%" textAnchor="middle" dy="8" fontSize="20px" fill="black">
        {percentage}%
      </text>
    </svg>
  );
};

export default CircleChart;
