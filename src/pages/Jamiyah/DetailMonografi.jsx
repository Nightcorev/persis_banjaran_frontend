import React, { useState } from "react";
import MusyawarahTab from "../Jamiyah/Tab/MusyawarahTab";
import AnggotaTab from "../Jamiyah/Tab/AnggotaTab";
import PesantrenTab from "../Jamiyah/Tab/PesantrenTab";
import FasilitasTab from "../Jamiyah/Tab/FasilitasTab";

const DetailMonografi = () => {
  const [activeTab, setActiveTab] = useState("musyawarah");

  const tabs = [
    { id: "musyawarah", label: "Musyawarah Jamaah" },
    { id: "anggota", label: "Anggota" },
    { id: "pesantren", label: "Pesantren" },
    { id: "fasilitas", label: "Fasilitas" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "musyawarah":
        return <MusyawarahTab />;
      case "anggota":
        return <AnggotaTab />;
      case "pesantren":
        return <PesantrenTab />;
      case "fasilitas":
        return <FasilitasTab />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">PJ PERSIS BANJARAN</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-300 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">HELMI SOFYAN</h2>
              <p className="text-sm">KETUA</p>
            </div>
            <div className="bg-gray-400 rounded-full h-20 w-20 mt-3"></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <StatCard title="53" subtitle="PERSIS" />
            <StatCard title="47" subtitle="PERSISTRI" />
            <StatCard title="62" subtitle="PEMUDA" />
            <StatCard title="49" subtitle="PEMUDI" />
          </div>
        </div>
        <div className="bg-gray-300 rounded-lg p-6">
          <InfoRow label="NAMA JAMAAH" value="BANJARAN" />
          <InfoRow label="NOMOR JAMAAH" value="1" />
          <InfoRow label="ALAMAT" value="Jl.Pajagalan 115 Ds.Banjaran Kec.Banjaran Kab.Bandung" />
        </div>
      </div>
      <div className="p-4 mt-5">
        {/* Tabs Header */}
        <div className="flex space-x-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-t-lg font-medium border border-gray-400 ${
                activeTab === tab.id ? "bg-white" : "bg-gray-500 text-white"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div className="p-6 bg-white rounded-b-3xl shadow-md border border-gray-400">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Utility components for the stats and info rows
const StatCard = ({ title, subtitle }) => (
  <div className="flex flex-col items-center justify-center bg-gray-500 h-16 rounded-lg text-white text-center">
    <span>{title}</span>
    <span>{subtitle}</span>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="mb-4">
    <h2 className="text-lg font-bold">{label}</h2>
    <p>{value}</p>
  </div>
);

export default DetailMonografi;
