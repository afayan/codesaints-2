import React, { useEffect, useState } from 'react';
import MyLineChart from './MyLineChart';

function Dashboard({ data }) {

  const [sentiment, setSentiment] = useState('')
  const [emotion, setEmotion] = useState('')
  const [tone, setTone] = useState('');
  const [pitch, setPitch] = useState(0)
  const [loudness, setLoudness] = useState(0)

  const [xvalues, setXvalues] = useState([])
  const [yvalues, setYvalues] = useState([])


  useEffect(()=>{

    if (data) {

      // console.log("data is",data);
      
      setSentiment(data["sentiment"])
      setEmotion(data["emotion"])
      setPitch(data["pitch"])
      setLoudness(data["loudness"])

      setXvalues([...xvalues, xvalues.length + 1])
      setYvalues([...yvalues, parseFloat(data["pitch"])])

    }




  }, [data])
 

      // sentiment, emotion, neutral, pitch, loudness


  const [stats, setStats] = useState({
    activeUsers: 1284,
    conversion: 24.8,
    avgSessionTime: 4.2,
    bounceRate: 32.5,
    newVisitors: 418,
    returningVisitors: 866,
    topDevices: { mobile: 68, desktop: 27, tablet: 5 },
    engagement: 76.3,
    topLocations: ['United States', 'India', 'Germany', 'Brazil', 'Japan'],
    performanceScore: 87
  });
  
  const [realtimeData, setRealtimeData] = useState({
    currentLoad: 72,
    responseTime: 230,
    serverStatus: 'LIVE',
    errorRate: 0.8,
    cpuUsage: 58,
    memoryUsage: 63,
    diskUsage: 42
  });
  
  useEffect(() => {
    // Update tone based on data trends
    if (data && data.length > 2) {
      const lastValue = data[data.length - 1].value;
      const prevValue = data[data.length - 2].value;
      
      if (lastValue > prevValue) {
        setTone('positive');
      } else if (lastValue < prevValue) {
        setTone('negative');
      } else {
        setTone('neutral');
      }
    }
    
    // Simulate changing stats
    const interval = setInterval(() => {
      setStats(prevStats => ({
        ...prevStats,
        activeUsers: Math.floor(prevStats.activeUsers + (Math.random() * 40 - 20)),
        conversion: +(prevStats.conversion + (Math.random() * 1 - 0.5)).toFixed(1),
        engagement: +(prevStats.engagement + (Math.random() * 2 - 1)).toFixed(1)
      }));
      
      setRealtimeData(prevData => ({
        ...prevData,
        currentLoad: Math.min(100, Math.max(10, Math.floor(prevData.currentLoad + (Math.random() * 10 - 5)))),
        responseTime: Math.min(500, Math.max(100, Math.floor(prevData.responseTime + (Math.random() * 40 - 20)))),
        errorRate: +(prevData.errorRate + (Math.random() * 0.4 - 0.2)).toFixed(1),
        cpuUsage: Math.min(100, Math.max(10, Math.floor(prevData.cpuUsage + (Math.random() * 8 - 4)))),
        memoryUsage: Math.min(100, Math.max(10, Math.floor(prevData.memoryUsage + (Math.random() * 6 - 3)))),
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [data]);
  
  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

    // sentiment, emotion, neutral, pitch, loudness

  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Performance Analytics</h1>
        <div className="dashboard-controls">
          <span className={`status-indicator ${realtimeData.serverStatus.toLowerCase()}`}>{realtimeData.serverStatus}</span>
        </div>
      </div>
      
      <div className="dashboard-summary">
        <div className={`summary-card ${tone}`}>
          <h3>Sentiment</h3>
          <div className="big-number">{sentiment}</div>
        </div>
        
        <div className={`summary-card ${tone}`}>
          <h3>Emotion</h3>
          <div className="big-number">{emotion}</div>
        </div>
        
        <div className={`summary-card ${tone}`}>
          <h3>Tone</h3>
          <div className="big-number">{tone}</div>
          <div className="label"></div>
        </div>
        
        <div className={`summary-card ${tone}`}>
          <h3>loudness</h3>
          <div className="big-number">{loudness}</div>
          <div className="label">Happy</div>
        </div>
      </div>
      
      <div className="chart-container">
        <div className="chart-header">
          <h2>Pitch</h2>
          <div className="chart-legend">
            <span className="legend-item">Current Period</span>
            <span className="legend-item previous">Previous Period</span>
          </div>
        </div>
        <MyLineChart xvalues = {xvalues} yvalues={yvalues} />
      </div>
      
      {/* <div className="metrics-grid">
        <div className="metric-card visitors">
          <h3>Accuracy</h3>
          <div className="metric-content">
            <div className="metric-stat">
              <span className="label">New</span>
              <span className="value">{formatNumber(stats.newVisitors)}</span>
            </div>
            <div className="metric-stat">
              <span className="label">Returning</span>
              <span className="value">{formatNumber(stats.returningVisitors)}</span>
            </div>
            <div className="metric-chart visitor-chart">
              <div className="pie-placeholder"></div>
            </div>
          </div>
        </div>

        
        <h1>Intervention</h1>
        
        <div className="inttab">

            <div className="inttablabels">
                <p>Low</p>
                <p>Medium</p>
                <p>High</p>
            </div>

            <div className="progbar">
                <div className="filled">

                </div>
            </div>

        </div>
        
        </div> */}
    </div>
  );
}

export default Dashboard;