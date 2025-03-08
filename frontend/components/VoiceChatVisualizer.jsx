import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import io from "socket.io-client";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const socket = io("http://localhost:9000"); // Change to your backend URL

const Visualization = () => {
  const [messages, setMessages] = useState([]);
  const [pitchData, setPitchData] = useState([]);
  const [loudnessData, setLoudnessData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [speakers, setSpeakers] = useState([]);

  useEffect(() => {
    socket.on("data", (data) => {
      const parsedData = JSON.parse(data);
      setMessages((prev) => [...prev, parsedData]);

      setPitchData((prev) => [...prev, parsedData.pitch]);
      setLoudnessData((prev) => [...prev, parsedData.loudness]);
      setLabels((prev) => [...prev, prev.length]);

      setSpeakers((prev) => [...prev, parsedData.speaker]);
    });

    return () => {
      socket.off("data");
    };
  }, []);

  const getBubbleColor = (speaker) =>
    speaker === "Customer" ? "bg-blue-500" : "bg-green-500";

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-4">
        Live Conversation Analysis
      </h1>

      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`p-3 rounded-lg text-white w-fit max-w-xs ${
              msg.speaker === "Customer" ? "self-start" : "self-end"
            } ${getBubbleColor(msg.speaker)}`}
            initial={{ opacity: 0, x: msg.speaker === "Customer" ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-semibold">{msg.speaker}</p>
            <p>{msg.text}</p>
            <p className="text-sm text-gray-300">
              Emotion: {msg.emotion} | Pitch: {msg.pitch.toFixed(2)} Hz | Loudness: {msg.loudness.toFixed(2)}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Pitch Analysis</h2>
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: "Pitch (Hz)",
                  data: pitchData,
                  borderColor: "blue",
                  fill: false,
                },
              ],
            }}
          />
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Loudness Analysis</h2>
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: "Loudness",
                  data: loudnessData,
                  borderColor: "green",
                  fill: false,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Visualization;
