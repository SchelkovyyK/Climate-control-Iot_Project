import { useEffect, useState } from "react";
import io from "socket.io-client";
import Main from "./components/Main/main";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function App() {
  const [logs, setLogs] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch(`${API_URL}/api/logs`);
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchLogs();
  }, []);

  useEffect(() => {
    const socketIo = io(API_URL);
    setSocket(socketIo);

    socketIo.on("new_log", (log) => setLogs((prev) => [...prev, log]));
    socketIo.on("cleared", () => setLogs([]));

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <div>
      <Main logs={logs} />;
    </div>
  );
}

export default App;
