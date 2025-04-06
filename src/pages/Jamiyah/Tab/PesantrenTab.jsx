import { useState, useEffect } from "react";
import api from "../../../utils/api";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const PesantrenTab = ({ masterJamaahId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [pesantrens, setPesantrens] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`${API_URL}/pesantren/by-jamaah/${masterJamaahId}`, {
          params: { page, perPage, searchTerm },
        });
        if (response.data.status === 200) {
          setPesantrens(response.data.data.data || []);
          setTotalItems(response.data.data.total || 0);
          setTotalPages(response.data.data.last_page || 1);
        } else {
          setError("Terjadi kesalahan saat mengambil data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Gagal mengambil data pesantren. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, perPage, searchTerm, masterJamaahId]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Data Pesantren</h2>

      <div className="flex items-center gap-4 mb-4">
      {/* Input Pencarian */}
      <input
        type="text"
        placeholder="Cari Pesantren..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1); // Reset ke halaman pertama saat pencarian berubah
        }}
        className="border p-2 mb-2 w-full"
      />

      {/* Dropdown Jumlah Data Per Halaman */}
      <select
        value={perPage}
        onChange={(e) => {
          setPerPage(Number(e.target.value));
          setPage(1); // Reset ke halaman pertama saat perPage berubah
        }}
        className="border p-2 mb-2"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto max-h-[65vh] border rounded-lg text-sm">
        <table className="table-auto w-full border-collapse border border-gray-300 text-black">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Nama Pesantren</th>
              <th className="border p-2">Tingkat</th>
              <th className="border p-2">Mudir</th>
              <th className="border p-2">Jumlah Santri</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-4">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-red-500">{error}</td>
              </tr>
            ) : pesantrens.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">Tidak ada data pesantren</td>
              </tr>
            ) : (
              pesantrens.map((pesantren) => (
                <tr key={pesantren.id_pesantren}>
                  <td className="border p-2">{pesantren.nama_pesantren}</td>
                  <td className="border p-2">{pesantren.tingkat}</td>
                  <td className="border p-2">{pesantren.nama_mudir}</td>
                  <td className="border p-2">{pesantren.jum_santri}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Navigasi Halaman */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          &laquo; Prev
        </button>
        <span>Halaman {page} dari {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
};

export default PesantrenTab;
