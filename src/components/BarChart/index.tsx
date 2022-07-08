import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
    },
    title: {
      display: true,
      text: "No Air",
    },
  },
  scales: {
    x: {
      grid: {
        borderColor: "rgba(196, 196, 196, 0.4)",
        color: "transparent",
      },
    },
    y: {
      grid: {
        borderColor: "rgba(196, 196, 196, 0.4)",
        color: "rgba(196, 196, 196, 0.08)",
      },
      //   ticks: {
      //     // Include a dollar sign in the ticks
      //     callback: function (value: any) {
      //       return "$" + value;
      //     },
      //   },
      title: { text: "USD", display: true, font: { size: 16 }, padding: 20 },
    },
  },
};
const labels = [
  "2017 H1",
  "2017 H2",
  "2018 H1",
  "2018 H2",
  "2019 H1",
  "2019 H2",
  "2020 H1",
  "2020 H2",
  "2021 H1",
  "2021 H2",
  "2022 H1",
];
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const cg = ctx?.createLinearGradient(0, 0, 0, 346);
cg?.addColorStop(0, "rgba(211, 35, 120, 0.5)");
cg?.addColorStop(1, "rgba(85, 59, 150, 0.5)");
const data = {
  labels,
  datasets: [
    {
      data: [
        2360.88, 2840.13, 3324.12, 3339.75, 3213.64, 3837.8, 3737.78, 4932.35,
        4432.78, 5117.13, 1738.58,
      ],
      backgroundColor: cg,
    },
  ],
};

const BarChart = () => {
  return <Bar options={options} data={data} height={80} />;
};

export default BarChart;
