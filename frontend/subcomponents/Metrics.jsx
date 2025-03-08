export default function Metrics({
    responseTime,
    sentimentScore,
    emotionLabel,
    pitch,
    loudness,
    isUser = false,
  }) {
    // Get sentiment color
    const getSentimentColor = (score) => {
      if (score > 0) return "#4CAF50"; // Green for positive
      if (score < 0) return "#F44336"; // Red for negative
      return "#9E9E9E"; // Grey for neutral
    };
  
    return (
      <div className={`metrics-card ${isUser ? "user-card" : "agent-card"}`}>
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Response Time</h3>
            <div className="metric-value">{responseTime}s</div>
            <div className="metric-description">Average response time</div>
          </div>
  
          <div className="metric-card">
            <h3>Sentiment Score</h3>
            <div className="metric-value" style={{ color: getSentimentColor(sentimentScore) }}>
              {sentimentScore}
            </div>
            <div className="sentiment-bar">
              <div className="sentiment-scale">
                <span>-1</span>
                <span>0</span>
                <span>1</span>
              </div>
              <div className="sentiment-track">
                <div
                  className="sentiment-indicator"
                  style={{
                    left: `${((sentimentScore + 1) / 2) * 100}%`,
                    backgroundColor: getSentimentColor(sentimentScore),
                  }}
                ></div>
              </div>
            </div>
          </div>
  
          <div className="metric-card">
            <h3>Emotion</h3>
            <div className="metric-value emotion">{emotionLabel}</div>
          </div>
  
          <div className="metric-card">
            <h3>Voice Metrics</h3>
            <div className="voice-metrics">
              <div className="voice-metric">
                <span>Pitch</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: `${pitch * 100}%` }}></div>
                </div>
                <span>{pitch.toFixed(2)}</span>
              </div>
              <div className="voice-metric">
                <span>Loudness</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: `${loudness * 100}%` }}></div>
                </div>
                <span>{loudness.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  