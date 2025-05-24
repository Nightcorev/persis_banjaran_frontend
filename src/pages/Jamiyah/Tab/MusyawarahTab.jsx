import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../utils/api";

const MusyawarahTab = ({ jamaahId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jamaahData, setJamaahData] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];

  const isSuperAdmin = "Super Admin";

  // Helper function
  const hasPermission = (perm) =>
    user?.role === isSuperAdmin ||
    (Array.isArray(permissions) && permissions.includes(perm));

  const fetchJamaahData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/jamaah-monografi/${jamaahId}`);
      setJamaahData(response.data.data);
    } catch (error) {
      console.error("Error fetching jamaah data:", error);
      setError("Gagal mengambil data jamaah. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jamaahId) {
      fetchJamaahData();
    }
  }, [jamaahId]);

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(tanggal).toLocaleDateString("id-ID", options);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await api.delete(`/delete_musyawarah/${id}`);
        fetchJamaahData();
      } catch (error) {
        console.error("Error deleting musyawarah:", error);
        alert("Gagal menghapus data. Silakan coba lagi.");
      }
    }
  };

  const total = jamaahData?.musyawarah?.length || 0;
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentItems =
    jamaahData?.musyawarah?.slice(startIndex, endIndex) || [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
      {/* Header with Add Button - Made responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-base sm:text-lg font-bold">Data Musyawarah</h2>
        {hasPermission("add_musyawarah_jamaah") && (
          <Link
            to={`/jamiyah/detail-jamiyah/data-musyawarah/add-musyawarah`}
            state={{ id_master_jamaah: jamaahId }}
          >
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Tambah Musyawarah
            </button>
          </Link>
        )}
      </div>

      {/* Table container - Made responsive while keeping table structure intact */}
      <div className="overflow-x-auto max-h-[50vh] sm:max-h-[65vh] border rounded-lg text-xs sm:text-sm">
        <table className="table-auto w-full border-collapse border border-gray-300 text-black">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">No</th>
              <th className="border p-2">Nomor SK</th>{" "}
              {/* Keeping original headers */}
              <th className="border p-2">Tanggal Pelaksanaan</th>
              <th className="border p-2">Tanggal Akhir Jihad</th>
              <th className="border p-2">Ketua Terpilih</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center border p-3 sm:p-4">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-t-2 border-green-500"></div>
                    <span className="ml-2">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center border p-3 sm:p-4 text-red-500"
                >
                  {error}
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((musyawarah, index) => {
                const ketuaDetail = musyawarah.musyawarah_detail.find(
                  (detail) => detail.jabatan === "Ketua"
                );
                return (
                  <tr
                    key={musyawarah.id_musyawarah}
                    className="hover:bg-gray-100"
                  >
                    <td className="border p-1 sm:p-2 text-center">
                      {startIndex + index + 1}
                    </td>
                    <td className="border p-1 sm:p-2 text-center">
                      {musyawarah.no_sk || "-"}
                    </td>
                    <td className="border p-1 sm:p-2 text-center">
                      {formatTanggal(musyawarah.tgl_pelaksanaan)}
                    </td>
                    <td className="border p-1 sm:p-2 text-center">
                      {formatTanggal(musyawarah.tgl_akhir_jihad)}
                    </td>
                    <td className="border p-1 sm:p-2 text-center">
                      {ketuaDetail?.anggota?.nama_lengkap || "-"}
                    </td>
                    <td className="border p-1 sm:p-2 text-center">
                      <span
                        className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm ${
                          musyawarah.aktif
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <span
                          className={`w-1 h-1 sm:w-1.5 sm:h-1.5 mr-1 rounded-full ${
                            musyawarah.aktif ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        {musyawarah.aktif ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>
                    <td className="border p-1 sm:p-2 text-center">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center items-center">
                        <Link
                          to={`/jamiyah/musyawarah/detail/${musyawarah.id_musyawarah}`}
                        >
                          <button className="bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-green-700 flex items-center justify-center w-full sm:w-auto">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-3 sm:size-4"
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

                        {hasPermission("edit_musyawarah_jamaah") && (
                          <Link
                            to={`/jamiyah/musyawarah/data-musyawarah/edit-musyawarah/${musyawarah.id_musyawarah}`}
                          >
                            <button className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-blue-600 flex items-center justify-center w-full sm:w-auto">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3 sm:size-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            </button>
                          </Link>
                        )}
                        {hasPermission("delete_musyawarah_jamaah") && (
                          <button
                            onClick={() =>
                              handleDelete(musyawarah.id_musyawarah)
                            }
                            className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-red-600 flex items-center justify-center w-full sm:w-auto"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-3 sm:size-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center border p-3 sm:p-4">
                  Tidak ada data musyawarah.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Made responsive */}
      {total > 0 && (
        <div className="mt-3 sm:mt-4 flex flex-wrap justify-between items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-white text-sm sm:text-base ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            ← Prev
          </button>

          <span className="text-xs sm:text-sm">
            Halaman {page} dari {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= totalPages}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-white text-sm sm:text-base ${
              page >= totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default MusyawarahTab;
