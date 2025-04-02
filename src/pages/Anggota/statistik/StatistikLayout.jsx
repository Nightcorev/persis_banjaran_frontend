import { useState, useEffect } from "react";
import ChartStatistic from "./ChartStatistic";
import MapStatistic from "./MapStatistic";
import axios from "axios";
import AdvancedStatistic from "./AdvancedStatistic";
import api from "../../../utils/api";

function StatistikLayout() {
  const [activeSection, setActiveSection] = useState("chart");
  const [monos, setMonos] = useState([]);

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
      })
      .catch(error => {
        console.error("Error fetching monografi data:", error);
      });
  }, []);

  const sections = [
    { key: "chart", label: "Chart" },
    { key: "maps", label: "Maps" },
    { key: "advanced", label: "Advanced Statistic" },
  ];

  return (
    <div className="p-4">
      <div className="flex gap-4">
        {monos.map((mono, index) => (
          <div
            key={index}
            className={`flex items-center p-4 w-1/4 text-white rounded-lg shadow-lg ${mono.color}`}
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
      </div>

      {/* Tab Navigation */}
      <div>
        <ul className="flex w-full justify-between border-b p-4 text-sm bg-white mt-4">
          {sections.map((section) => (
            <li
              key={section.key}
              className={`cursor-pointer p-1 border-b-2 ${
                activeSection === section.key ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => setActiveSection(section.key)}
            >
              {section.label}
            </li>
          ))}
        </ul>
      </div>
        {activeSection === "chart" && <ChartStatistic />}
        {activeSection === "maps" && <MapStatistic />}
        {activeSection === "advanced" && <AdvancedStatistic />}
    </div>
  );
}

export default StatistikLayout;
