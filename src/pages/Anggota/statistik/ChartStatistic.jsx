import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
import api from "../../../utils/api";

function ChartStatistik() {
  const [selectedChart, setSelectedChart] = useState("Bar");
  const [selectedData, setSelectedData] = useState("anggota");
  const [monos, setMonos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState({ 
    pendidikan: [], 
    pekerjaan: [], 
    keterampilan: [], 
    anggota: [] 
  });

  useEffect(() => {
    api.get("/data_chart")
      .then((response) => setResponseData(response.data))
      .catch((error) => console.error("Error fetching data_chart:", error));

      setLoading(false);
    // api.get("/data_monografi")
    //   .then(response => {
    //     const data = response.data.data_monografi;
    //     setMonos([
    //       { title: "Jumlah Persis", count: data.jum_persis, color: "#22c55e" }, 
    //       { title: "Jumlah Persistri", count: data.jum_persistri, color: "#3b82f6" }, 
    //       { title: "Jumlah Pemuda", count: data.jum_pemuda, color: "#ef4444" }, 
    //       { title: "Jumlah Pemudi", count: data.jum_pemudi, color: "#fbbf24" }
    //     ]);
    //   })
    //   .catch(error => console.error("Error fetching monografi data:", error));
  }, []);

  const dataOptions = ["anggota", "pendidikan", "pekerjaan", "keterampilan", "mubaligh"];
  
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

  const randomColors = [
    "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
    "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
    "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
    "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
    "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
    "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
    "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680"
  ];

  if (selectedData === "anggota") {
    chartData = {
      labels,
      datasets: [
        {
          label: "Persis",
          data: selectedStats.map(stat => stat.jum_persis),
          backgroundColor: selectedChart === "Pie"
          ? randomColors.slice(0, labels.length) // Gunakan warna sesuai jumlah jamaah
          : "#22c55e",
        },
        {
          label: "Persistri",
          data: selectedStats.map(stat => stat.jum_persistri),
          backgroundColor: selectedChart === "Pie"
          ? randomColors.slice(0, labels.length) // Gunakan warna sesuai jumlah jamaah
          : "#3b82f6",
        },
        {
          label: "Pemuda",
          data: selectedStats.map(stat => stat.jum_pemuda),
          backgroundColor: selectedChart === "Pie"
          ? randomColors.slice(0, labels.length) // Gunakan warna sesuai jumlah jamaah
          : "#ef4444",
        },
        {
          label: "Pemudi",
          data: selectedStats.map(stat => stat.jum_pemudi),
          backgroundColor: selectedChart === "Pie"
          ? randomColors.slice(0, labels.length) // Gunakan warna sesuai jumlah jamaah
          : "#fbbf24",
        },
      ],
    };
  } else {
    chartData = {
      labels,
      datasets: [
        {
          label: "Jumlah Anggota",
          data: selectedStats.map(stat => stat.jumlah_anggota),
          backgroundColor: randomColors.slice(0, labels.length),
        },
      ],
    };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Statistik Mono */}
      {/* <div className="flex gap-4">
        {monos.map((mono, index) => (
          <div
            key={index}
            className={`flex items-center p-4 w-1/4 text-white rounded-lg shadow-lg`}
            style={{ backgroundColor: mono.color }}
          >
            <div className="p-3 bg-white rounded-full text-gray-700">
              <span className="text-2xl">👤</span>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold">{mono.title}</h3>
              <p className="text-2xl font-bold">{mono.count}</p>
            </div>
          </div>
        ))}
      </div> */}

      {/* Chart */}
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

        {/* Render Chart */}
        {selectedChart === "Bar" ? (
          <div className="w-[1000px] h-[500px] mx-auto">
          <Bar 
            data={chartData} 
            options={{ maintainAspectRatio: false }}
          />
        </div>
) : (
  <div className="w-[1000px] h-[600px] mx-auto">
    <Pie 
      data={chartData} 
      options={{ maintainAspectRatio: false }}
    />
  </div>
)}

      </div>
    </div>
  );
}

export default ChartStatistik;
