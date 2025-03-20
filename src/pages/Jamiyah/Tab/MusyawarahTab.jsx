import React, { useState, useEffect } from "react";
import axios from "axios";

const MusyawarahTab = ({ jamaahId, masterJamaahId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [jamaahData, setJamaahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJamaahData = async () => {
      setLoading(true);
      try {
        // Use masterJamaahId for fetching jamaah data
        const response = await axios.get(
          `http://127.0.0.1:8000/api/jamaah-monografi/${masterJamaahId}`
        );
        
        console.log("API response:", response.data);
        
        // Set the jamaah data (which contains musyawarah details)
        setJamaahData(response.data.data || null);
      } catch (error) {
        console.error("Error fetching jamaah data:", error);
        setError("Gagal mengambil data jamaah. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (masterJamaahId) {
      fetchJamaahData();
    }
  }, [masterJamaahId]);

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(tanggal).toLocaleDateString("id-ID", options);
  };

  if (loading) return <div>Memuat data musyawarah...</div>;
  if (error) return <div>{error}</div>;
  if (!jamaahData) return <div>Tidak ada data musyawarah.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Data Musyawarah</h2>
      
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">No</th>
              <th className="border p-2">Tanggal Musjam</th>
              <th className="border p-2">Ketua Terpilih</th>
              <th className="border p-2">Habis Masa Jihad</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 text-center">1</td>
              <td className="border p-2">{formatTanggal(jamaahData.tgl_pelaksanaan)}</td>
              <td className="border p-2">{jamaahData.nama_lengkap}</td>
              <td className="border p-2">{formatTanggal(jamaahData.tgl_akhir_jihad)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MusyawarahTab;