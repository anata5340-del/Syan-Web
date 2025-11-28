"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart(props: any) {
  const color: string = props.color;
  const width: number = props.widthBorder;
  const count: number = props.count;
  const total: number = props.total;

  const data = {
    type: "pie",
    labels: [],
    datasets: [
      {
        label: "Users",
        data: total === count ? [total] : [count, total - count], // Full pie if count equals total
        backgroundColor: total === count ? [color] : [color, "#f8f8f8"],
        hoverOffset: 4,
        radius: 30,
        borderWidth: width,
        circumference: 360, // Full pie
      },
    ],
  };

  return (
    <div className="w-20">
      <Pie data={data} />
    </div>
  );
}
