import React, { useState, useEffect } from "react";
import axios from "axios";

const MusyawarahTab = ({ masterJamaahId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [jamaahData, setJamaahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJamaahData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/jamaah-monografi/${masterJamaahId}`,
          {
            params: { searchTerm, perPage },
          }
        );

        console.log("API response:", response.data);

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
  }, [masterJamaahId, searchTerm, perPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(tanggal).toLocaleDateString("id-ID", options);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Data Musyawarah</h2>

      {/* Input Pencarian & Dropdown PerPage */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Cari ketua terpilih..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded w-full"
        />
        <select value={perPage} onChange={handlePerPageChange} className="border p-2 rounded">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Menampilkan Error */}
      {error && <div className="text-red-500">{error}</div>}

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
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-4">Memuat data...</td>
              </tr>
            ) : jamaahData ? (
              <tr>
                <td className="border p-2 text-center">1</td>
                <td className="border p-2">{formatTanggal(jamaahData.tgl_pelaksanaan)}</td>
                <td className="border p-2">{jamaahData.nama_lengkap}</td>
                <td className="border p-2">{formatTanggal(jamaahData.tgl_akhir_jihad)}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">Tidak ada data musyawarah.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MusyawarahTab;
