import React, { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Statistik() {
  const [selectedChart, setSelectedChart] = useState("Bar");
  const [selectedData, setSelectedData] = useState("Jamaah");

  const dataOptions = ["Jamaah", "Pendidikan", "Usia"];

  const monos = [
    { title: "Total Members", count: 1200, color: "bg-blue-500", route: "/users/data-anggota" },
    { title: "Active Members", count: 850, color: "bg-green-500", route: "" },
    { title: "Inactive Members", count: 350, color: "bg-red-500" , route: ""},
  ];

  const stats = {
    Jamaah: [
      { title: "Total Members", count: 1200, color: "bg-blue-500", route: "/users/data-anggota" },
      { title: "Active Members", count: 850, color: "bg-green-500", route: "" },
      { title: "Inactive Members", count: 350, color: "bg-red-500", route: ""},
    ],
    Pendidikan: [
      { title: "SD", count: 400, color: "bg-blue-500", route: "" },
      { title: "SMP", count: 300, color: "bg-green-500", route: "" },
      { title: "SMA", count: 500, color: "bg-red-500", route: "" },
    ],
    Usia: [
      { title: "Anak-anak", count: 200, color: "bg-blue-500", route: "" },
      { title: "Dewasa", count: 700, color: "bg-green-500", route: "" },
      { title: "Lansia", count: 300, color: "bg-red-500", route: "" },
    ]
  };

  const labels = stats[selectedData].map(stat => stat.title);
  const dataValues = stats[selectedData].map(stat => stat.count);
  const backgroundColors = ["#3b82f6", "#22c55e", "#ef4444"];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Members",
        data: dataValues,
        backgroundColor: backgroundColors,
      },
    ],
  };

  return (
    <div className="p-4">
      <div className="flex gap-4">
        {monos.map((mono, index) => (
          <div
            key={index}
            className={`flex items-center p-4 w-1/3 text-white rounded-lg shadow-lg ${mono.color}`}
          >
            <div className="p-3 bg-white rounded-full text-gray-700">
              <span className="text-2xl">👤</span>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold">{mono.title}</h3>
              <p className="text-2xl font-bold">{mono.count}</p>
            </div>
            <a href={mono.route}><button className="ml-auto px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 text-xs">
              Selengkapnya
            </button></a>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-4 shadow-lg rounded-lg ">
        <div className="mb-2">
          <div className="flex-row space-x-4">
              <label className="text-lg pe-2">Pilih Data</label>
              <select
                className="w-sm p-2 pe-10 border rounded-md text-xs"
                value={selectedData}
                onChange={(e) => setSelectedData(e.target.value)}
              >
                {dataOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <label className="text-lg pe-2">Pilih Chart</label>
              <select
                className="w-sm p-2 pe-10 border rounded-md text-xs"
                value={selectedChart}
                onChange={(e) => setSelectedChart(e.target.value)}
              >
                <option value="Bar">Bar Chart</option>
                <option value="Doughnut">Doughnut Chart</option>
              </select>
          </div>
          
        </div>

        {selectedChart === "Bar" ? <Bar data={chartData} /> : <Doughnut data={chartData} />}
      </div>
    </div>
  );
}

export default Statistik;
