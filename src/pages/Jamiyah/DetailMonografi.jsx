import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import MusyawarahTab from "../Jamiyah/Tab/MusyawarahTab";
import AnggotaTab from "../Jamiyah/Tab/AnggotaTab";
import PesantrenTab from "../Jamiyah/Tab/PesantrenTab";
import FasilitasTab from "../Jamiyah/Tab/FasilitasTab";
import api from "../../utils/api";

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
        const response = await api.get(`/jamaah-monografi/${id}`);
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

  // Get current active musyawarah and its ketua
  const currentMusyawarah = jamaah.musyawarah?.find(m => m.aktif);
  const ketuaJamaah = currentMusyawarah?.musyawarah_detail?.find(d => d.jabatan === "Ketua")?.anggota;

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
      <div className="flex flex-wrap gap-6 p-4">
        {/* Profile Card */}
        <div className="w-full md:w-64 bg-white shadow-md rounded-3xl p-4 text-center">
          <div className="relative">
            {ketuaJamaah?.foto ? (
              <div className="h-80 rounded-md overflow-hidden">
                <img 
                  src={`http://localhost:8000/storage/uploads/${ketuaJamaah.foto}`} 
                  alt="Foto Ketua"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-80 bg-gray-300 flex items-center justify-center rounded-md">
                <span className="text-gray-500">Foto</span>
              </div>
            )}
          </div>
          <p className="font-bold text-lg mt-4">{ketuaJamaah?.nama_lengkap || "Belum ada ketua"}</p>
          <p className="text-gray-600">KETUA JAMAAH</p>
        </div>

        {/* Statistics & Details */}
        <div className="flex-1 space-y-4">
          {/* Detail Information */}
          <div className="bg-white p-6 rounded-3xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-bold text-gray-700">NAMA JAMAAH</p>
                <p className="text-gray-600">{jamaah.nama_jamaah}</p>
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="font-bold text-gray-700">STATUS</p>
                {jamaah.aktif ? (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full">
                    <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                    Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-semibold bg-red-100 text-red-800 rounded-full">
                    <span className="w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
                    Tidak Aktif
                  </span>
                )}
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="font-bold text-gray-700">ALAMAT</p>
                <p className="text-gray-600">{jamaah.alamat}</p>
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="font-bold text-gray-700">LOKASI MAPS</p>
                <a 
                  href={jamaah.lokasi_map} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Buka di Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="p-4 bg-white rounded-2xl shadow-md">
              <p className="text-sm font-medium text-gray-600 mb-1">PERSIS</p>
              <h3 className="text-2xl font-semibold text-gray-800">{jamaah.jum_persis || 0}</h3>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-md">
              <p className="text-sm font-medium text-gray-600 mb-1">PERSISTRI</p>
              <h3 className="text-2xl font-semibold text-gray-800">{jamaah.monografi?.jum_persistri || 0}</h3>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-md">
              <p className="text-sm font-medium text-gray-600 mb-1">PEMUDA</p>
              <h3 className="text-2xl font-semibold text-gray-800">{jamaah.monografi?.jum_pemuda || 0}</h3>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-md">
              <p className="text-sm font-medium text-gray-600 mb-1">PEMUDI</p>
              <h3 className="text-2xl font-semibold text-gray-800">{jamaah.monografi?.jum_pemudi || 0}</h3>
            </div>
          </div>
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
export const StatCard = ({ title, subtitle, color = "blue" }) => (
  <div className={`flex flex-col items-center justify-center bg-${color}-600 hover:bg-${color}-700 transition-colors h-20 rounded-lg text-white text-center shadow-md`}>
    <span className="text-xl font-bold">{title}</span>
    <span className="text-sm">{subtitle}</span>
  </div>
);

// Modifikasi InfoRow component
export const InfoRow = ({ icon, label, value }) => (
  <div className="mb-6 last:mb-0">
    <div className="flex items-center gap-2 mb-1">
      {getIcon(icon)}
      <h2 className="text-lg font-bold text-blue-800">{label}</h2>
    </div>
    {icon === "maps" ? (
      <a 
        href={value} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 hover:text-blue-800 ml-7 flex items-center gap-2"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
          />
        </svg>
        Buka di Google Maps
      </a>
    ) : (
      <p className="text-gray-700 ml-7">{value}</p>
    )}
  </div>
);

// Tambahkan icon maps di getIcon function
const getIcon = (type) => {
  const iconClass = "w-5 h-5 text-blue-600";
  switch (type) {
    case "building":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case "hashtag":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      );
    case "location":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "maps":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      );
    default:
      return null;
  }
};

export default DetailMonografi;
