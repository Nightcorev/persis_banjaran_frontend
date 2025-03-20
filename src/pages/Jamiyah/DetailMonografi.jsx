import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import MusyawarahTab from "../Jamiyah/Tab/MusyawarahTab";
import AnggotaTab from "../Jamiyah/Tab/AnggotaTab";
import PesantrenTab from "../Jamiyah/Tab/PesantrenTab";
import FasilitasTab from "../Jamiyah/Tab/FasilitasTab";

const DetailMonografi = () => {
  const { id } = useParams(); // Mengambil id dari URL
  const [jamaah, setJamaah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("musyawarah");
  const [masterJamaahId, setMasterJamaahId] = useState(null);

  const tabs = [
    { id: "musyawarah", label: "Musyawarah Jamaah" },
    { id: "anggota", label: "Anggota" },
    { id: "pesantren", label: "Pesantren" },
    { id: "fasilitas", label: "Fasilitas" },
  ];

  useEffect(() => {
    const fetchJamaahDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/jamaah-monografi/${id}`
        );
        setJamaah(response.data.data);
        // Store the id_master_jamaah separately
        setMasterJamaahId(response.data.data.id_master_jamaah);
      } catch (error) {
        console.error("Error fetching jamaah detail:", error);
        setError("Gagal mengambil detail jamaah. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchJamaahDetail();
  }, [id]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "musyawarah":
        return <MusyawarahTab jamaahId={id} masterJamaahId={masterJamaahId} />;
      case "anggota":
        return <AnggotaTab jamaahId={id} masterJamaahId={masterJamaahId} />;
      case "pesantren":
        return <PesantrenTab jamaahId={id} masterJamaahId={masterJamaahId} />;
      case "fasilitas":
        return <FasilitasTab jamaahId={id} masterJamaahId={masterJamaahId} />;
      default:
        return null;
    }
  };

  if (loading) return <div className="p-6">Memuat data...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!jamaah) return <div className="p-6">Data jamaah tidak ditemukan.</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{jamaah.nama_jamaah}</h1>
        <Link
          to="/jamiyah/data-jamiyah"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Kembali
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-300 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">{jamaah.nama_lengkap}</h2>
              <p className="text-sm">KETUA</p>
            </div>
            <div className="bg-gray-400 rounded-full h-20 w-20 mt-3"></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <StatCard title={jamaah.jml_persis} subtitle="PERSIS" />
            <StatCard title={jamaah.jml_persistri} subtitle="PERSISTRI" />
            <StatCard title={jamaah.jml_pemuda} subtitle="PEMUDA" />
            <StatCard title={jamaah.jml_pemudi} subtitle="PEMUDI" />
          </div>
        </div>
        <div className="bg-gray-300 rounded-lg p-6">
          <InfoRow label="NAMA JAMAAH" value={jamaah.nama_jamaah} />
          <InfoRow label="NOMOR JAMAAH" value={jamaah.id_master_jamaah} />
          <InfoRow label="ALAMAT" value={jamaah.alamat} />
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