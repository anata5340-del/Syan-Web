"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LineElement, LinearScale, PointElement, Filler);

export default function LineChart({
  data,
  type,
}: {
  data: any[];
  type: "users" | "finances";
}) {
  const [gradient, setGradient] = useState<CanvasGradient | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(253,201,206,1)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      setGradient(gradient);
    }
  }, []);

  const labels = data?.map((item) =>
    type === "users" ? item.date : item.month || item.date
  );
  const values = data?.map((item) => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: type === "users" ? "Users" : "Finances",
        data: values,
        borderColor: "#EF6A77",
        pointBackgroundColor: "#EF6A77",
        tension: 0.4,
        fill: {
          target: "origin",
          above: gradient,
          below: "",
        },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return type === "users"
              ? `Users: ${tooltipItem.raw}`
              : `Finances: PKR ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
