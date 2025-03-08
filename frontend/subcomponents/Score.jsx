export default function Score({ score }) {
    // Determine color based on score
    const getScoreColor = (score) => {
      if (score >= 70) return "#4CAF50"; // Green
      if (score >= 40) return "#FFC107"; // Yellow
      return "#F44336"; // Red
    };
  
    const color = getScoreColor(score);
  
    // Calculate the circle's circumference and offset
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
  
    return (
      <div className="score-display">
        <h2>Overall QA Score</h2>
        <div className="circular-progress">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle cx="100" cy="100" r={radius} fill="transparent" stroke="#e0e0e0" strokeWidth="10" />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="transparent"
              stroke={color}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
            <text
              x="100"
              y="100"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="36"
              fontWeight="bold"
              fill={color}
            >
              {score}
            </text>
            <text x="100" y="130" textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="#666">
              out of 100
            </text>
          </svg>
        </div>
      </div>
    );
  }
  