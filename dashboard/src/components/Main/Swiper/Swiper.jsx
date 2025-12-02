import React from "react";
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
  const lastLogs = logs.slice();
  const timeLabels = lastLogs.map((log) => log.time);

  const createDataset = (label, data, color) => ({
    labels: timeLabels,
    datasets: [
      {
        label,
        data: lastLogs.map((l) => l[data]),
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
        tension: 0.3,
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
              data={{
                labels: lastLogs.map((log) => log.time),
                datasets: [
                  {
                    label: "Temperature (°C)",
                    data: lastLogs.map((log) => log.temp),
                    borderColor: "red",
                    backgroundColor: "rgba(255,0,0,0.2)",
                    fill: true,
                    tension: 0.3,
                  },
                  {
                    label: "Humidity (%)",
                    data: lastLogs.map((log) => log.hum),
                    borderColor: "blue",
                    backgroundColor: "rgba(0,0,255,0.2)",
                    fill: true,
                    tension: 0.3,
                  },
                  {
                    label: "Gas",
                    data: lastLogs.map((log) => log.gas),
                    borderColor: "green",
                    backgroundColor: "rgba(0,255,0,0.2)",
                    fill: true,
                    tension: 0.3,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                },
                scales: {
                  y: { beginAtZero: false },
                  x: { ticks: { maxRotation: 45, minRotation: 0 } },
                },
              }}
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
