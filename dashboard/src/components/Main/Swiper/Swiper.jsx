// ChartsSwiper.jsx
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Swiper.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartsSwiper({ logs }) {
  // State to manage how many logs to display, default to last 50
  const [logLimit, setLogLimit] = useState(50);
  const [inputLimit, setInputLimit] = useState(50);

  // Derive the filtered data whenever 'logs' or 'logLimit' changes
  // Use Math.max to prevent negative slice indexes if logs length is smaller than limit
  const limitedLogs = logs.slice(Math.max(logs.length - logLimit, 0));
  const timeLabels = limitedLogs.map((log) => log.time);

  const handleLimitChange = (e) => setInputLimit(e.target.value);

  const applyLimit = () => {
    const newLimit = parseInt(inputLimit, 10);
    if (!isNaN(newLimit) && newLimit > 0) {
      setLogLimit(newLimit);
    }
  };

  const showAllLogs = () => {
    setLogLimit(logs.length || 99999);
    setInputLimit(logs.length || 99999);
  };

  const showLast50Logs = () => {
    setLogLimit(50);
    setInputLimit(50);
  };

  // Modified createDataset function to highlight emergencies visually
  const createDataset = (label, dataKey, color) => ({
    labels: timeLabels,
    datasets: [
      {
        label,
        data: limitedLogs.map((l) => l[dataKey]),
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
        tension: 0.3,
        // Emergency Highlighting Logic:
        pointBackgroundColor: limitedLogs.map((log) =>
          log.emergency ? "yellow" : color
        ),
        pointBorderColor: limitedLogs.map((log) =>
          log.emergency ? "red" : color
        ),
        pointRadius: limitedLogs.map((log) => (log.emergency ? 6 : 3)),
        pointBorderWidth: limitedLogs.map((log) => (log.emergency ? 3 : 1)),
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: false } },
  };

  return (
    <div className="charts-swiper-container">
      <div style={{ padding: "10px", textAlign: "center", background: "#fff" }}>
        <button onClick={showAllLogs}>Show All Logs ({logs.length})</button>
        <button onClick={showLast50Logs}>Show Last 50 Logs</button>
        <span> | </span>
        <input
          type="number"
          value={inputLimit}
          onChange={handleLimitChange}
          style={{ width: "80px", padding: "5px" }}
        />
        <button onClick={applyLimit}>Show Specific Logs</button>
        <p>
          Displaying {limitedLogs.length} of {logs.length} total logs.
        </p>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Pagination, Navigation]}
      >
        <SwiperSlide>
          <div className="chart-wrapper">
            <Line
              data={createDataset("Combined Sensor Data", "temp", "red")}
              options={options}
            />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="chart-wrapper">
            <Line
              data={createDataset("Temperature", "temp", "red")}
              options={options}
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="chart-wrapper">
            <Line
              data={createDataset("Humidity", "hum", "blue")}
              options={options}
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="chart-wrapper">
            <Line
              data={createDataset("Gas", "gas", "green")}
              options={options}
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
