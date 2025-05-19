import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

  if (loading) return <div className="p-3 sm:p-6">Memuat data...</div>;
  if (error) return <div className="p-3 sm:p-6 text-red-500">{error}</div>;
  if (!jamaah) return <div className="p-3 sm:p-6">Data jamaah tidak ditemukan.</div>;

  // Get current active musyawarah and its ketua
  const currentMusyawarah = jamaah.musyawarah?.find(m => m.aktif);
  const ketuaJamaah = currentMusyawarah?.musyawarah_detail?.find(d => d.jabatan === "Ketua")?.anggota;

  return (
    <div className="p-3 sm:p-6 bg-white rounded-lg shadow-lg">
      {/* Header - Made responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">{jamaah.nama_jamaah}</h1>
        <Link
          to="/jamiyah/data-jamiyah"
          className="bg-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-blue-600 text-sm sm:text-base"
        >
          Kembali
        </Link>
      </div>
      
      {/* Main content area - Made responsive with flex-wrap and better column sizing */}
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 p-2 sm:p-4">
        {/* Profile Card - Fixed width on desktop, full width on mobile */}
        <div className="w-full md:w-64 bg-white shadow-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-center">
          <div className="relative">
            {ketuaJamaah?.foto ? (
              <div className="h-60 sm:h-80 rounded-md overflow-hidden">
                <img 
                  src={`http://localhost:8000/storage/uploads/${ketuaJamaah.foto}`} 
                  alt="Foto Ketua"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-60 sm:h-80 bg-gray-300 flex items-center justify-center rounded-md">
                <span className="text-gray-500">Foto</span>
              </div>
            )}
          </div>
          <p className="font-bold text-base sm:text-lg mt-3 sm:mt-4">{ketuaJamaah?.nama_lengkap || "Belum ada ketua"}</p>
          <p className="text-gray-600 text-sm sm:text-base">KETUA JAMAAH</p>
        </div>

        {/* Statistics & Details - Flex grow to fill space */}
        <div className="flex-1 space-y-3 sm:space-y-4">
          {/* Detail Information */}
          <div className="bg-white p-3 sm:p-6 rounded-2xl sm:rounded-3xl shadow-md sm:shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <p className="font-bold text-gray-700 text-sm sm:text-base">NAMA JAMAAH</p>
                <p className="text-gray-600 text-sm sm:text-base">{jamaah.nama_jamaah}</p>
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="font-bold text-gray-700 text-sm sm:text-base">STATUS</p>
                {jamaah.aktif ? (
                  <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold bg-green-100 text-green-800 rounded-full">
                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 mr-1 bg-green-500 rounded-full"></span>
                    Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold bg-red-100 text-red-800 rounded-full">
                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 mr-1 bg-red-500 rounded-full"></span>
                    Tidak Aktif
                  </span>
                )}
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="font-bold text-gray-700 text-sm sm:text-base">ALAMAT</p>
                <p className="text-gray-600 text-sm sm:text-base">{jamaah.alamat}</p>
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="font-bold text-gray-700 text-sm sm:text-base">LOKASI MAPS</p>
                <a 
                  href={jamaah.lokasi_map} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Buka di Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Stats - Responsive grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mt-3 sm:mt-4">
            <div className="p-2 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-md">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1">PERSIS</p>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">{jamaah.jum_persis || 0}</h3>
            </div>
            <div className="p-2 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-md">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1">PERSISTRI</p>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">{jamaah.monografi?.jum_persistri || 0}</h3>
            </div>
            <div className="p-2 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-md">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1">PEMUDA</p>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">{jamaah.monografi?.jum_pemuda || 0}</h3>
            </div>
            <div className="p-2 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-md">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1">PEMUDI</p>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">{jamaah.monografi?.jum_pemudi || 0}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Section - Made scrollable on mobile */}
      <div className="p-2 sm:p-4 mt-3 sm:mt-5">
        {/* Tabs Header - Scrollable on mobile */}
        <div className="flex overflow-x-auto pb-1 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-t-lg font-medium text-sm sm:text-base border border-gray-400 whitespace-nowrap mr-1 sm:mr-3 ${
                activeTab === tab.id ? "bg-white" : "bg-gray-500 text-white"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div className="p-3 sm:p-6 bg-white rounded-b-2xl sm:rounded-b-3xl shadow-md border border-gray-400">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Utility components for the stats and info rows - Made responsive
export const StatCard = ({ title, subtitle, color = "blue" }) => (
  <div className={`flex flex-col items-center justify-center bg-${color}-600 hover:bg-${color}-700 transition-colors h-16 sm:h-20 rounded-lg text-white text-center shadow-md`}>
    <span className="text-lg sm:text-xl font-bold">{title}</span>
    <span className="text-xs sm:text-sm">{subtitle}</span>
  </div>
);

// Modified InfoRow component for responsiveness
export const InfoRow = ({ icon, label, value }) => (
  <div className="mb-4 sm:mb-6 last:mb-0">
    <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
      {getIcon(icon)}
      <h2 className="text-base sm:text-lg font-bold text-blue-800">{label}</h2>
    </div>
    {icon === "maps" ? (
      <a 
        href={value} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 hover:text-blue-800 ml-5 sm:ml-7 flex items-center gap-1 sm:gap-2 text-sm"
      >
        <svg 
          className="w-4 h-4 sm:w-5 sm:h-5" 
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
      <p className="text-gray-700 ml-5 sm:ml-7 text-sm sm:text-base">{value}</p>
    )}
  </div>
);

// Added responsive sizing to icons
const getIcon = (type) => {
  const iconClass = "w-4 h-4 sm:w-5 sm:h-5 text-blue-600";
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

// Add a style block to hide scrollbars on mobile tab navigation
const styleBlock = document.createElement('style');
styleBlock.textContent = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(styleBlock);

export default DetailMonografi;
