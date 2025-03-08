import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Dashboard from "../components/Dashboard";
import Dashboard2 from "../components/Dashboard2";
import VoiceChatPage from "./pages/VoiceChatPage"; // Import new page

const socket = io("http://localhost:9000");

function App() {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [liveAudio, setLiveAudio] = useState(true);
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [speak, setSpeak] = useState("")

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
  
    const formData = new FormData();
  
    
  }

  // sentiment, emotion, neutral, pitch, loudness

  function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    socket.on("data", (data) => {
      if (isJsonString(data)) {

        
        let d = JSON.parse(data)
        
        console.log(d);

        if (d["speaker"] == "start") {
          setSpeak("start speaking")
          
        } else if (d["speaker"] == "User") {
          setData1(JSON.parse(data));
        } else {
          setData2(JSON.parse(data));
        }
      }

      // setStats({ ...data });
    });
  }, []);

  async function startrecord() {
    setSpeak("wait")
    socket.emit("audio-stream");
    setRecording(true);
  }

  async function stoprecord() {
    setSpeak("")
    socket.emit("stop-recording");
    setRecording(false);
  }

  return (
    <>
      <div>
        <div className="topbar">
          <button onClick={() => setLiveAudio(true)}>Live</button>
          <button onClick={() => setLiveAudio(false)}>Recorded</button>
        </div>

        <div className="recordsection">
          {liveAudio ? (

<>

{!recording ? (
  <button id="record" onClick={() => startrecord()}>Record</button>
) : (
  <button id="record" onClick={() => stoprecord()}>Stop</button>
)}

{<p>{speak}</p>}
</>


          ) : (
            <>
              <input type="file" />
              <button>Submit</button>
            </>
          )}
        </div>

        <div className="dashboardcontainer">

          <span>
          <h1>User</h1>

          <Dashboard data={data1} />
          </span>

          <span>
          <h1>Agent</h1>
          <Dashboard data={data2} />
          </span>

         
        </div>
      </div>
    </>
  );
}

export default App;
