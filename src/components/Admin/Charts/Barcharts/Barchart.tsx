"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// const months = ["January", "February", "March", "April", "May", "June", "July"];
const Allmonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Setting up Month
const dynamicMonthData: string[] = [];
const previousSixMonthIncludingCurrent = new Date();
previousSixMonthIncludingCurrent.setMonth(
  previousSixMonthIncludingCurrent.getMonth() - 5
);

for (let i = 0; i < 6; i++) {
  let month = previousSixMonthIncludingCurrent.getMonth();

  dynamicMonthData.push(Allmonths[month]);
  month = month + 1;
  previousSixMonthIncludingCurrent.setMonth(
    previousSixMonthIncludingCurrent.getMonth() + 1
  );
}

interface ChartProps {
  label1: string;
  label2: string;
  data1: number[];
  data2: number[];
  labels?: string[];
  backgroundColor1: string;
  backgroundColor2: string;
  title?: string;
}

export function BarChart({
  label1,
  label2,
  data1,
  data2,
  labels = dynamicMonthData,
  backgroundColor1,
  backgroundColor2,
  title,
}: ChartProps) {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive font sizes and padding
  const getFontSize = () => {
    if (windowWidth < 640) return 10; // Mobile
    if (windowWidth < 1024) return 12; // Tablet
    return 14; // Desktop
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: windowWidth > 640,
    aspectRatio: windowWidth < 768 ? 1 : 2,
    plugins: {
      legend: {
        display: true,
        position: windowWidth < 640 ? "bottom" : "top",
        labels: {
          color: "#F3F4F6", // text-gray-100
          font: {
            size: getFontSize(),
          },
          padding: windowWidth < 640 ? 10 : 20,
        },
      },
      title: {
        display: !!title,
        text: title || "",
        color: "#FFFFFF", // text-white
        font: {
          size: getFontSize() + 4,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#FFFFFF",
        bodyColor: "#F3F4F6",
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#F3F4F6", // text-gray-100
          font: {
            size: getFontSize(),
          },
          maxRotation: windowWidth < 640 ? 45 : 0,
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#F3F4F6", // text-gray-100
          font: {
            size: getFontSize(),
          },
        },
      },
    },
  };

  const data: ChartData<"bar", number[], string> = {
    labels,
    datasets: [
      {
        label: label1,
        data: data1,
        backgroundColor: backgroundColor1,
        barThickness: windowWidth < 640 ? 15 : "flex",
        barPercentage: windowWidth < 768 ? 0.8 : 1,
        categoryPercentage: windowWidth < 768 ? 0.3 : 0.4,
        borderRadius: 4,
        hoverBackgroundColor: backgroundColor1
          .replace(")", ", 0.8)")
          .replace("rgb", "rgba"),
      },
      {
        label: label2,
        data: data2,
        backgroundColor: backgroundColor2,
        barThickness: windowWidth < 640 ? 15 : "flex",
        barPercentage: windowWidth < 768 ? 0.8 : 1,
        categoryPercentage: windowWidth < 768 ? 0.3 : 0.4,
        borderRadius: 4,
        hoverBackgroundColor: backgroundColor2
          .replace(")", ", 0.8)")
          .replace("rgb", "rgba"),
      },
    ],
  };

  return (
    <div className="w-full h-full p-4 rounded-lg bg-gradient-to-br from-black to-gray-900 shadow-xl">
      <div
        className={`w-full ${
          windowWidth < 640 ? "h-64" : "h-auto"
        } flex items-center justify-center`}
      >
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}

// For Next.js compatibility with 'use client' directive
const BarChartNextJS = (props: ChartProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-64 rounded-lg bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading chart...</div>
      </div>
    );
  }

  return <BarChart {...props} />;
};

export default BarChartNextJS;
