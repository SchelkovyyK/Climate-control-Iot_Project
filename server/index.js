// index.js
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const http = require("http");
const cron = require('node-cron'); // npm install node-cron if you want automatic cleanup

const { insertLog, getLogs, clearLogs, deleteOldLogs } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static React build files
app.use(express.static(path.join(__dirname, "../dashboard/build")));


// --- FIX IS HERE: Declare server and io BEFORE they are referenced ---
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" },
});
// ------------------------------------------------------------------


function cleanAndConvertLog(logEntry) {
  try {
    if (!logEntry || !logEntry.log) return null;
    const text = logEntry.log;
    if (text.includes("[exception]")) return null;
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      time: parsed.time,
      temp: parsed.temp,
      hum: parsed.hum,
      gas: parsed.gas,
      emergency: parsed.emergency,
    };
  } catch {
    return null;
  }
}

app.post("/api/log", async (req, res) => {
  const cleaned = cleanAndConvertLog(req.body);
  if (!cleaned) return res.json({ status: "ignored" });

  try {
    await insertLog(cleaned);
    io.emit("new_log", cleaned);
    res.json({ status: "saved" });
  } catch (err) {
    console.error("DB Insert Error:", err);
    res.status(500).json({ error: "db error" });
  }
});

app.get("/api/logs", async (req, res) => {
  try {
    const logs = await getLogs();
    res.json(logs);
  } catch (err) {
    console.error("DB Fetch Error:", err);
    res.json([]);
  }
});

app.post("/api/clear", async (req, res) => {
  try {
    await clearLogs();
    io.emit("cleared");
    res.json({ status: "cleared" });
  } catch (err) {
    console.error("DB Clear Error:", err);
    res.json({ status: "error" });
  }
});

// Endpoint to manually trigger the old log cleanup
app.post("/api/clear-old", async (req, res) => {
  try {
    const deletedCount = await deleteOldLogs(5); 
    res.json({ status: "cleared old logs", count: deletedCount });
  } catch (err) {
    console.error("DB Clear Old Error:", err);
    res.status(500).json({ status: "error" });
  }
});


// Fallback for React app routing
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dashboard/build/index.html"));
});

// Start the server using the 'server' variable
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);

  // Schedule automatic daily cleanup at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily task to delete old logs...');
    try {
      // Deletes logs older than 5 days
      await deleteOldLogs(5); 
    } catch (error) {
      console.error('Scheduled log cleanup failed:', error);
    }
  });
});
