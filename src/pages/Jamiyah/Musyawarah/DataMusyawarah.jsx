import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const DataMusyawarah = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [musyawarah, setMusyawarah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchMusyawarahData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`${API_URL}/data_musyawarah`, {
          params: { page, perPage, search: searchTerm },
        });
        const musyawarahArray = response.data?.data?.data || [];
        const totalData = response.data?.data?.total || 0;
        setMusyawarah(musyawarahArray);
        setTotal(totalData);
      } catch (error) {
        console.error("Error fetching musyawarah data:", error);
        setError("Gagal mengambil data musyawarah. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchMusyawarahData();
  }, [page, perPage, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await api.delete(`${API_URL}/delete_musyawarah/${id}`);
        alert("Data berhasil dihapus.");
        setMusyawarah((prev) => prev.filter((item) => item.id_musyawarah !== id));
      } catch (error) {
        console.error("Error deleting musyawarah:", error);
        alert("Gagal menghapus data. Silakan coba lagi.");
      }
    }
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(tanggal).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Data Musyawarah</h1>
        <a href="/jamiyah/musyawarah/data-musyawarah/add-musyawarah">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-gray-500">
            + Tambah Data
          </button>
        </a>
      </div>

      {/* Pencarian dan Dropdown */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center text-sm">
          <label className="mr-2">Tampilkan:</label>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1); // Reset ke page 1 kalau ganti perPage
            }}
            className="border p-2 rounded"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="ml-2">data per halaman</span>
        </div>

        <div className="flex items-center text-sm">
          <label htmlFor="search" className="mr-2">
            Cari:
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset ke page 1 saat cari
            }}
            placeholder="Cari musyawarah..."
            className="border p-2 rounded"
          />
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto max-h-[65vh] border rounded-lg text-sm">
        <table className="table-auto w-full border-collapse border border-gray-300 text-black">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">No</th>
              <th className="border p-2">Nama Jamaah</th>
              <th className="border p-2">Tanggal Pelaksanaan</th>
              <th className="border p-2">Tanggal Akhir Jihad</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center border p-4">
                  Memuat data...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="text-center border p-4 text-red-500">
                  {error}
                </td>
              </tr>
            ) : musyawarah.length > 0 ? (
              musyawarah.map((item, index) => (
                <tr key={item.id_musyawarah} className="hover:bg-gray-100">
                  <td className="border p-2 text-center">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td className="border p-2 text-center">
                    {item.master_jamaah.nama_jamaah}
                  </td>
                  <td className="border p-2 text-center">
                    {formatTanggal(item.tgl_pelaksanaan)}
                  </td>
                  <td className="border p-2 text-center">
                    {formatTanggal(item.tgl_akhir_jihad)}
                  </td>
                  <td className="border p-2 text-center">
                    {item.aktif ? "Aktif" : "Tidak Aktif"}
                  </td>
                  <td className="border p-2 text-center">
                    <div className="flex justify-center gap-2">
                      {/* View Button */}
                      <Link to={`/jamiyah/musyawarah/detail/${item.id_musyawarah}`}>
                        <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </button>
                      </Link>

                      {/* Edit Button */}
                      <Link to={`/jamiyah/musyawarah/data-musyawarah/edit-musyawarah/${item.id_musyawarah}`}>
                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>
                      </Link>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item.id_musyawarah)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center border p-4">
                  Tidak ada data musyawarah.
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
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Halaman {page} dari {Math.max(1, Math.ceil(total / perPage))}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= Math.ceil(total / perPage)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataMusyawarah;
