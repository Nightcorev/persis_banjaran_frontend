import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
import api from "../../../utils/api";

function ChartStatistik() {
  const [selectedChart, setSelectedChart] = useState("Bar");
  const [selectedData, setSelectedData] = useState("anggota");
  
  const [responseData, setResponseData] = useState({ 
    pendidikan: [], 
    pekerjaan: [], 
    keterampilan: [], 
    anggota: [] 
  });
  
  // const [monografiData, setMonografiData] = useState({ 
  //   jum_persistri: 0, 
  //   jum_pemuda: 0, 
  //   jum_pemudi: 0, 
  //   jum_persis: 0 
  // });

  useEffect(() => {
      api
        .get("/data_chart")
        .then((response) => {
          setResponseData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data_chart:", error);
        });
  
      // aps
    }, []);

  const dataOptions = [
    "anggota", 
    "pendidikan", 
    "pekerjaan", 
    "keterampilan", 
    "mubaligh"
  ];
  
  const selectedStats = responseData[selectedData] || [];

  const labels = selectedStats.map(stat => {
    if (selectedData === "anggota") return stat.nama_jamaah;
    if (selectedData === "pendidikan") return stat.tingkat_pendidikan;
    if (selectedData === "pekerjaan") return stat.nama_pekerjaan;
    if (selectedData === "keterampilan") return stat.nama_keterampilan;
    if (selectedData === "mubaligh") return stat.nama_jamaah; 
    return "";
  });

  let chartData;

  if (selectedData === "anggota") {
    chartData = {
      labels,
      datasets: [
        {
          label: "Jumlah Persis",
          data: selectedStats.map(stat => stat.jum_persis),
          backgroundColor: "#22c55e", // Biru
        },
        {
          label: "Jumlah Persistri",
          data: selectedStats.map(stat => stat.jum_persistri),
          backgroundColor: "#3b82f6", // Hijau
        },
        {
          label: "Jumlah Pemuda",
          data: selectedStats.map(stat => stat.jum_pemuda),
          backgroundColor: "#ef4444", // Merah
        },
        {
          label: "Jumlah Pemudi",
          data: selectedStats.map(stat => stat.jum_pemudi),
          backgroundColor: "#fbbf24", // Kuning
        }
      ]
    };
  } else {
    chartData = {
      labels,
      datasets: [
        {
          label: "Jumlah Anggota",
          data: selectedStats.map(stat => stat.jumlah_anggota),
          backgroundColor: ["#3b82f6", "#22c55e", "#ef4444", "#fbbf24", "#8b5cf6", "#ec4899", "#10b981", "#6366f1", "#f97316", "#14b8a6"],
        },
      ],
    };
  }

  return (
      <div className="bg-white p-4 shadow-lg rounded-lg">
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
              <option value="Pie">Pie Chart</option>
            </select>
          </div>
        </div>

        {selectedChart === "Bar" ? <Bar data={chartData} /> : <Pie data={chartData} />}
      </div>
  );
}

export default ChartStatistik;
