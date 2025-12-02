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
  const [logLimit, setLogLimit] = useState(50);
  const [inputLimit, setInputLimit] = useState(50);

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

  const combinedChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: limitedLogs.map((log) => log.temp),
        borderColor: "red",
        backgroundColor: "rgba(182, 67, 0)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: limitedLogs.map((log) =>
          log.emergency ? "yellow" : "red"
        ),
        pointBorderColor: limitedLogs.map((log) =>
          log.emergency ? "red" : "red"
        ),
        pointRadius: limitedLogs.map((log) => (log.emergency ? 6 : 3)),
      },
      {
        label: "Humidity (%)",
        data: limitedLogs.map((log) => log.hum),
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.2)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: limitedLogs.map((log) =>
          log.emergency ? "yellow" : "blue"
        ),
        pointBorderColor: limitedLogs.map((log) =>
          log.emergency ? "red" : "blue"
        ),
        pointRadius: limitedLogs.map((log) => (log.emergency ? 6 : 3)),
      },
      {
        label: "Gas",
        data: limitedLogs.map((log) => log.gas),
        borderColor: "green",
        backgroundColor: "rgba(0,255,0,0.2)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: limitedLogs.map((log) =>
          log.emergency ? "yellow" : "green"
        ),
        pointBorderColor: limitedLogs.map((log) =>
          log.emergency ? "red" : "green"
        ),
        pointRadius: limitedLogs.map((log) => (log.emergency ? 6 : 3)),
      },
    ],
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
            <Line data={combinedChartData} options={options} />
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
