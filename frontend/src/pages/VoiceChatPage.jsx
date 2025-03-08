import VoiceChatVisualizer from "../../components/VoiceChatVisualizer";

import { Link } from "react-router-dom";

const VoiceChatPage = () => {
  return (
    <div>
      <h1>Voice Chat Analysis</h1>
      <VoiceChatVisualizer />
      <Link to="/">Back to Dashboard</Link>
    </div>
  );
};

export default VoiceChatPage;
