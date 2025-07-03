import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
import api from "../../../utils/api";

function ChartStatistik() {
  const [selectedChart, setSelectedChart] = useState("Bar");
  const [selectedData, setSelectedData] = useState("anggota");
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState({ 
    pendidikan: [], 
    pekerjaan: [], 
    keterampilan: [], 
    anggota: [] 
  });

  const randomColors = [
    "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
    "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
    "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
    "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
    "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
    "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
    "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680"
  ];

  useEffect(() => {
    api.get("/data_chart")
      .then((response) => setResponseData(response.data))
      .catch((error) => console.error("Error fetching data_chart:", error));
      setLoading(false);
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

  const generateChartData = () => {
    if (selectedData === "anggota") {
      return {
        labels,
        datasets: [
          {
            label: "Persis",
            data: selectedStats.map(stat => stat.jum_persis),
            backgroundColor: selectedChart === "Pie" 
              ? randomColors.slice(0, labels.length)
              : "#22c55e",
          },
          {
            label: "Persistri",
            data: selectedStats.map(stat => stat.jum_persistri),
            backgroundColor: selectedChart === "Pie" 
              ? randomColors.slice(0, labels.length)
              : "#3b82f6",
          },
          {
            label: "Pemuda",
            data: selectedStats.map(stat => stat.jum_pemuda),
            backgroundColor: selectedChart === "Pie" 
              ? randomColors.slice(0, labels.length)
              : "#ef4444",
          },
          {
            label: "Pemudi",
            data: selectedStats.map(stat => stat.jum_pemudi),
            backgroundColor: selectedChart === "Pie" 
              ? randomColors.slice(0, labels.length)
              : "#fbbf24",
          },
        ],
      };
    } else {
      return {
        labels,
        datasets: [{
          label: "Jumlah Anggota",
          data: selectedStats.map(stat => stat.jumlah_anggota),
          backgroundColor: randomColors.slice(0, labels.length),
        }],
      };
    }
  };

  const chartData = generateChartData();

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((context.raw / total) * 100);
            return `Persentase: ${percentage}%`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          callback: function(value) {
            const label = this.getLabelForValue(value);
            return label.length > 8 ? `${label.substring(0, 8)}...` : label;
          },
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 10,
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 12,
          font: {
            size: 10,
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: label.length > 15 ? `${label.substring(0, 15)}...` : label,
                fillStyle: data.datasets[0].backgroundColor[i],
                hidden: false,
                index: i
              }));
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4">
      <div className="bg-white p-3 md:p-4 shadow-lg rounded-lg">
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4">
            <div className="flex-1">
              <label className="text-sm md:text-base pe-2">Pilih Data</label>
              <select
                className="w-full p-2 border rounded-md text-sm md:text-base"
                value={selectedData}
                onChange={(e) => setSelectedData(e.target.value)}
              >
                {dataOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm md:text-base pe-2">Pilih Chart</label>
              <select
                className="w-full p-2 border rounded-md text-sm md:text-base"
                value={selectedChart}
                onChange={(e) => setSelectedChart(e.target.value)}
              >
                <option value="Bar">Bar Chart</option>
                <option value="Pie">Pie Chart</option>
              </select>
            </div>
          </div>
        </div>

        {selectedChart === "Bar" ? (
          <div className="flex flex-col gap-4">
            <div className="relative w-full h-96 overflow-x-auto">
              <div 
                className="absolute min-w-full" 
                style={{ height: '100%', minWidth: `${labels.length * 50}px` }}
              >
                <Bar 
                  data={chartData}
                  options={barOptions}
                />
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-3 text-sm md:text-base">Detail Data</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">No</th>
                      <th className="px-4 py-2 text-left">Label</th>
                      {selectedData === "anggota" && (
                        <>
                          <th className="px-4 py-2 text-left">Persis</th>
                          <th className="px-4 py-2 text-left">Persistri</th>
                          <th className="px-4 py-2 text-left">Pemuda</th>
                          <th className="px-4 py-2 text-left">Pemudi</th>
                        </>
                      )}
                      {selectedData !== "anggota" && (
                        <th className="px-4 py-2 text-left">Jumlah</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedStats.map((stat, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2 max-w-xs truncate" title={labels[index]}>
                          {labels[index]}
                        </td>
                        {selectedData === "anggota" && (
                          <>
                            <td className="px-4 py-2">{stat.jum_persis}</td>
                            <td className="px-4 py-2">{stat.jum_persistri}</td>
                            <td className="px-4 py-2">{stat.jum_pemuda}</td>
                            <td className="px-4 py-2">{stat.jum_pemudi}</td>
                          </>
                        )}
                        {selectedData !== "anggota" && (
                          <td className="px-4 py-2 font-medium">{stat.jumlah_anggota}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-2/3 h-96 lg:h-[500px]">
              <Pie 
                data={chartData}
                options={pieOptions}
              />
            </div>
            <div className="w-full lg:w-1/3 overflow-y-auto max-h-96 border rounded-lg p-4">
              <h3 className="font-bold mb-2 text-sm md:text-base">Detail Data:</h3>
              <ul className="space-y-2">
                {selectedStats.map((stat, index) => (
                  <li key={index} className="flex items-center">
                    <span 
                      className="inline-block w-3 h-3 mr-2 rounded-full"
                      style={{ 
                        backgroundColor: randomColors[index % randomColors.length] 
                      }}
                    ></span>
                    <span className="truncate flex-1" title={labels[index]}>
                      {labels[index]}
                    </span>
                    <span className="font-semibold ml-2">
                      {selectedData === "anggota" 
                        ? `Persis:${stat.jum_persis} Persistri:${stat.jum_persistri} Pemuda:${stat.jum_pemuda} Pemudi:${stat.jum_pemudi}`
                        : stat.jumlah_anggota}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChartStatistik;