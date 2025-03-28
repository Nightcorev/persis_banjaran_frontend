import React, { useState, useEffect } from "react";
import axios from "axios";

const MusyawarahTab = ({ masterJamaahId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [anggotaData, setAnggota] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/anggota/by-jamaah/${masterJamaahId}`, {
          params: { page, searchTerm, perPage }
        });

        console.log("API response:", response.data);

        setAnggota(response.data.data || null);
      } catch (error) {
        console.error("Error fetching jamaah data:", error);
        setError("Gagal mengambil data jamaah. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (masterJamaahId) {
      fetchData();
    }
  }, [masterJamaahId, page, searchTerm, perPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset ke halaman pertama saat mencari
  };

  const handleNextPage = () => {
    if (anggotaData && anggotaData.next_page_url) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (anggotaData && anggotaData.prev_page_url) {
      setPage((prev) => Math.max(prev - 1, 1));
    }
  };

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setPage(1); // Reset ke halaman pertama saat mengganti perPage
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(tanggal).toLocaleDateString("id-ID", options);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Data Anggota</h2>

      {/* Input Pencarian & Dropdown PerPage */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Cari nama..."
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
              <th className="border p-2">Foto</th>
              <th className="border p-2">NIK</th>
              <th className="border p-2">Nama Lengkap</th>
              <th className="border p-2">Tanggal Lahir</th>
              <th className="border p-2">Pendidikan</th>
              <th className="border p-2">Pekerjaan</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-4">Memuat data...</td>
              </tr>
            ) : anggotaData && anggotaData.data.length > 0 ? (
              anggotaData.data.map((anggota, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center">{(page - 1) * perPage + index + 1}</td>
                  <td className="border p-2 text-center">
                      <img
                      src={`$/public/uploads/${anggota.foto}`}
                      alt="Foto User"
                      className="w-12 h-12 object-cover rounded-full mx-auto"
                    />
                    </td>
                  <td className="border p-2">{anggota.nik}</td>
                  <td className="border p-2">{anggota.nama_lengkap}</td>
                  <td className="border p-2">{formatTanggal(anggota.tanggal_lahir)}</td>
                  <td className="border p-2">{anggota.anggota_pendidikan?.instansi || "-"}</td>
                  <td className="border p-2">{anggota.anggota_pekerjaan?.master_pekerjaan?.nama_pekerjaan || "-"}</td>
                  <td
                      className={`border p-2 text-center ${
                        anggota.status_aktif === 1
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {anggota.status_aktif === 1 ? "Aktif" : "Tidak Aktif"}
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4">Tidak ada data anggota.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button onClick={handlePrevPage} disabled={!anggotaData?.prev_page_url} className="p-2 bg-gray-300 rounded">
          Prev
        </button>
        <span>Halaman {anggotaData?.current_page || 1} dari {anggotaData?.last_page || 1}</span>
        <button onClick={handleNextPage} disabled={!anggotaData?.next_page_url} className="p-2 bg-gray-300 rounded">
          Next
        </button>
      </div>
    </div>
  );
};

export default MusyawarahTab;
