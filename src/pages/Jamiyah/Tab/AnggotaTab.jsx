import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../utils/api";

const AnggotaTab = ({ masterJamaahId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [anggotas, setAnggotas] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/anggota/by-jamaah/${masterJamaahId}`;

        const response = await api.get(url);

        console.log("API response:", response.data);

        if (response.data.status === 200) {
          // Handle Laravel pagination data structure
          setAnggotas(response.data.data.data || []);
          setTotalItems(response.data.data.total || 0);
          setTotalPages(response.data.data.last_page || 1);
        } else {
          setError("Terjadi kesalahan saat mengambil data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Gagal mengambil data anggota. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, perPage, searchTerm, masterJamaahId]);

  // Handle search with debounce
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(tanggal).toLocaleDateString("id-ID", options);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Data Anggota</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Cari anggota..."
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabel Anggota */}
      <div className="overflow-x-auto max-h-[65vh] border rounded-lg text-sm">
        <table className="table-auto w-full border-collapse border border-gray-300 text-black">
          <thead className="bg-gray-200">
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
                <td colSpan="8" className="text-center border p-4">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
                    Loading...
                  </div>
                </td>
              </tr>
            ) : anggotas.length > 0 ? (
              anggotas.map((anggota, index) => (
                <tr key={anggota.id_anggota} className="hover:bg-gray-100">
                  <td className="border p-2 text-center">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td className="border p-2 text-center">
                    <img
                      src={`/media/images/anggota/${
                        anggota.foto || "default.jpg"
                      }`}
                      alt="Foto Anggota"
                      className="w-12 h-12 rounded-full object-cover mx-auto"
                      onError={(e) => {
                        e.target.src = "/media/images/anggota/default.jpg";
                      }}
                    />
                  </td>
                  <td className="border p-2 text-center">
                    {anggota.nik || "-"}
                  </td>
                  <td className="border p-2 text-center">
                    {anggota.nama_lengkap}
                  </td>
                  <td className="border p-2 text-center">
                    {formatTanggal(anggota.tanggal_lahir)}
                  </td>
                  <td className="border p-2 text-center">
                    {anggota.anggota_pendidikan.instansi || "-"}
                  </td>
                  <td className="border p-2 text-center">
                    {anggota.anggota_pekerjaan.master_pekerjaan
                      .nama_pekerjaan || "-"}
                  </td>
                  <td className="border p-2 text-center">
                    {anggota.status_aktif === 1
                      ? "Aktif"
                      : anggota.status_aktif === 2
                      ? "Meninggal"
                      : anggota.status_aktif === 3
                      ? "Mutasi"
                      : "Tidak Diketahui"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center border p-4">
                  Tidak ada data anggota.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || loading}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Halaman {page} dari {totalPages || 1}
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0 || loading}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AnggotaTab;
