import { useState, useEffect } from "react";
import ChartStatistic from "./ChartStatistic";
import MapStatistic from "./MapStatistic";
import axios from "axios";
import AdvancedStatistic from "./AdvancedStatistic";
import api from "../../../utils/api";

function StatistikLayout() {
  const [activeSection, setActiveSection] = useState("chart");
  const [monos, setMonos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/data_monografi")
      .then(response => {
        const data = response.data.data_monografi;
        setMonos([
          { title: "Jumlah Persis", count: data.jum_persis, color: "bg-green-500" },
          { title: "Jumlah Persistri", count: data.jum_persistri, color: "bg-blue-500" },
          { title: "Jumlah Pemuda", count: data.jum_pemuda, color: "bg-red-500" },
          { title: "Jumlah Pemudi", count: data.jum_pemudi, color: "bg-yellow-500" }
        ]);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching monografi data:", error);
      });
  }, []);

  const sections = [
    { key: "chart", label: "Chart", icon: "📊" },
    { key: "advanced", label: "Advanced Statistic", icon: "📈" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 md:mb-6">
        {monos.map((mono, index) => (
          <div
            key={index}
            className={`flex items-center p-4 md:p-6 text-white rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 ${mono.color}`}
          >
            <div className="p-2 md:p-3 bg-white bg-opacity-30 rounded-full">
              <span className="text-xl md:text-2xl">👤</span>
            </div>
            <div className="ml-3 md:ml-4 flex-1">
              <h3 className="text-sm md:text-lg font-semibold">{mono.title}</h3>
              <p className="text-xl md:text-2xl font-bold">{mono.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-4 md:mb-6">
        <ul className="flex border-b border-gray-200">
          {sections.map((section) => (
            <li
              key={section.key}
              className={`flex-1 text-center`}
            >
              <button
                onClick={() => setActiveSection(section.key)}
                className={`w-full py-3 md:py-4 px-2 md:px-6 flex items-center justify-center space-x-1 md:space-x-2 font-medium text-xs md:text-sm focus:outline-none transition-colors ${
                  activeSection === section.key 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            </li>
          ))}
        </ul>
        
        {/* Tab Content */}
        <div className="p-3 md:p-6">
          {activeSection === "chart" && <ChartStatistic />}
          {activeSection === "advanced" && <AdvancedStatistic />}
        </div>
      </div>
    </div>
  );
}

export default StatistikLayout;