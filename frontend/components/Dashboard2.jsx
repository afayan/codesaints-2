"use client"

import { useEffect, useState } from "react";
import Header from "../subcomponents/Score";
import Alert from "../subcomponents/Alert";
import Metrics from "../subcomponents/Metrics";


export default function Dashboard2() {
  const [data, setData] = useState({
    qaScore: 75,
    responseTime: 3.2,
    sentimentScore: 0.6,
    emotionLabel: "Happy",
    pitch: 0.7,
    loudness: 0.8,
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fluctuating QA score
      const newQaScore = Math.max(0, Math.min(100, data.qaScore + (Math.random() * 20 - 10)));

      // Simulate fluctuating sentiment score between -1 and 1
      const newSentimentScore = Math.max(-1, Math.min(1, data.sentimentScore + (Math.random() * 0.4 - 0.2)));

      // Determine emotion based on sentiment score
      let newEmotionLabel = "Neutral";
      if (newSentimentScore > 0.5) newEmotionLabel = "Happy";
      else if (newSentimentScore > 0) newEmotionLabel = "Neutral";
      else if (newSentimentScore > -0.5) newEmotionLabel = "Frustrated";
      else newEmotionLabel = "Angry";

      // Simulate fluctuating response time
      const newResponseTime = Math.max(0.5, Math.min(10, data.responseTime + (Math.random() - 0.5)));

      // Simulate fluctuating pitch and loudness
      const newPitch = Math.max(0, Math.min(1, data.pitch + (Math.random() * 0.2 - 0.1)));
      const newLoudness = Math.max(0, Math.min(1, data.loudness + (Math.random() * 0.2 - 0.1)));

      setData({
        qaScore: Number.parseFloat(newQaScore.toFixed(1)),
        responseTime: Number.parseFloat(newResponseTime.toFixed(1)),
        sentimentScore: Number.parseFloat(newSentimentScore.toFixed(2)),
        emotionLabel: newEmotionLabel,
        pitch: Number.parseFloat(newPitch.toFixed(2)),
        loudness: Number.parseFloat(newLoudness.toFixed(2)),
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className={`dashboard dark`}>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <Header />
        </div>

        <div className="dashboard-content">
          <div className="score-section">
            <Alert score={data.qaScore} />
          </div>

          <div className="metrics-container">
            <div className="metrics-section user-metrics">
              <h2 className="section-title">User Data</h2>
              <AgentMetrics
                responseTime={data.responseTime}
                sentimentScore={data.sentimentScore}
                emotionLabel={data.emotionLabel}
                pitch={data.pitch}
                loudness={data.loudness}
                isUser={true}
              />
            </div>

            <div className="metrics-section agent-metrics">
              <h2 className="section-title">Agent Data</h2>
              <AgentMetrics
                responseTime={2.8}
                sentimentScore={0.8}
                emotionLabel="Happy"
                pitch={0.6}
                loudness={0.7}
                isUser={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}