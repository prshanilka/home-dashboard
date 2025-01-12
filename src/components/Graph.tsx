import { FC } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface GraphProps {
  title: string;
  labels: string[];
  data: number[];
  yAxisLabel: string;
}

const Graph: FC<GraphProps> = ({ title, labels, data, yAxisLabel }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: yAxisLabel,
        data,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Timestamp",
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
        },
      },
    },
  };

  return (
    <div className="max-w-[1024px]">
      <h3>{title}</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Graph;
