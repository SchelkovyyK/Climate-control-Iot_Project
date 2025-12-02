import React, { useEffect, useState } from "react";
import ChartsSwiper from "./Swiper/Swiper";
import Table from "./table/table";
import { io } from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const socket = io(API_URL);

function Main() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Initial fetch
    fetch(`${API_URL}/api/logs`)
      .then(res => res.json())
      .then(setLogs)
      .catch(console.error);

    // Listen for real-time updates
    socket.on("new_log", (log) => setLogs(prev => [...prev, log]));
    socket.on("cleared", () => setLogs([]));

    // Cleanup listeners on unmount
    return () => {
      socket.off("new_log");
      socket.off("cleared");
    };
  }, []);

  return (
    <main className="main">
      <ChartsSwiper className="screen1" logs={logs} />
      <Table className="screen2" logs={logs} />
    </main>
  );
}

export default Main;
