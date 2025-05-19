import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../utils/api";

const DataMonografi = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [jamiyah, setJamiyah] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
  const account = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/data_jamaah?page=${page}&perPage=${perPage}&searchTerm=${searchTerm}`
      );
      setJamiyah(response.data.data.data);
      setTotal(response.data.data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Gagal mengambil data, coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, perPage, searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await api.delete(`/delete-jamaah/${id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting jamaah:", error);
        alert("Gagal menghapus data. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-white rounded-lg shadow-lg">
      {/* Header with Add Button - Made responsive with flex direction */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h1 className="text-lg font-bold">Data Jamaah</h1>
        <Link to="/jamiyah/add-jamiyah">
          <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 w-full sm:w-auto">
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
            Tambah Jamaah
          </button>
        </Link>
      </div>

      {/* Existing perPage and search controls - Made responsive */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center text-sm">
          <label className="mr-2">Tampilkan:</label>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border p-1.5 rounded"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="ml-2">data per halaman</span>
        </div>

        {/* Input Pencarian */}
        <div className="flex items-center text-sm w-full sm:w-auto">
          <label htmlFor="search" className="mr-2">
            Cari:
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari data..."
            className="border p-1.5 rounded w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className="flex justify-center items-center my-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500"></div>
          <span className="ml-3 text-gray-600">Memuat data...</span>
        </div>
      )}
      
      {/* Table container - Made the container responsive but kept table intact */}
      {!loading && (
      <div className="overflow-x-auto max-h-[60vh] border rounded-lg text-sm">
        <table className="table-auto w-full border-collapse border border-gray-300 text-black">
          <thead className="bg-gray-200">
            <>
              <tr>
                <th rowSpan="2">No</th>
                <th rowSpan="2">Nama Jama'ah</th>
                <th rowSpan="2">Ketua PJ</th>
                <th rowSpan="2">Tanggal Musjam</th>
                <th rowSpan="2">Akhir Masa Jihad</th>
                <th colSpan="4">
                  <center>Jumlah Anggota</center>
                </th>
                <th rowSpan="2">
                  <center>Mubaligh</center>
                </th>
                <th rowSpan="2">
                  <center>Asatidz</center>
                </th>
                <th colSpan="6">
                  <center>Jumlah Santri</center>
                </th>
                <th rowSpan="2">
                  <center>Aksi</center>
                </th>
              </tr>
              <tr>
                <th>Persis</th>
                <th>Persistri</th>
                <th>Pemuda</th>
                <th>Pemudi</th>
                <th>RA</th>
                <th>MD</th>
                <th>MI</th>
                <th>TSn</th>
                <th>SMP</th>
                <th>MLN</th>
              </tr>
            </>
          </thead>
          <tbody>
            {jamiyah.length > 0 ? (
              jamiyah.map((data_jamiyah, index) => {
                const currentMusyawarah = data_jamiyah.musyawarah?.find(m => m.aktif) || {};
                const ketuaJamaah = currentMusyawarah?.musyawarah_detail?.find(d => d.jabatan === "Ketua")?.anggota?.nama_lengkap || "-";
                const monografi = data_jamiyah.monografi || {};

                return (
                  <tr key={data_jamiyah.id_master_jamaah} className="hover:bg-gray-100">
                    <td className="border p-2 text-center">
                      {(page - 1) * perPage + index + 1}
                    </td>
                    <td className="border p-2 text-center">
                      {data_jamiyah.nama_jamaah}
                    </td>
                    <td className="border p-2 text-center">
                      {ketuaJamaah}
                    </td>
                    <td className="border p-2 text-center">
                      {formatDate(currentMusyawarah.tgl_pelaksanaan)}
                    </td>
                    <td className="border p-2 text-center">
                      {formatDate(currentMusyawarah.tgl_akhir_jihad)}
                    </td>
                    <td className="border p-2 text-center">
                      {data_jamiyah.jumlah_persis || 0}
                    </td>
                    <td className="border p-2 text-center">
                      {monografi.jum_persistri || 0}
                    </td>
                    <td className="border p-2 text-center">
                      {monografi.jum_pemuda || 0}
                    </td>
                    <td className="border p-2 text-center">
                      {monografi.jum_pemudi || 0}
                    </td>
                    <td className="border p-2 text-center">
                      {monografi.jum_mubaligh || 0}
                    </td>
                    <td className="border p-2 text-center">
                      {monografi.jum_asatidz || 0}
                    </td>
                    <td className="border p-2 text-center">
                      {monografi.jum_santri_ra || 0}
                    </td>
                    <td className="border p-2 text-center">
                      {monografi.jum_santri_md || 0}
                    </td>
                    <td className="border p-2 text-center">
                      {monografi.jum_santri_mi || 0}
                    </td>
                    <td className="border p-2 text-center">
                      {monografi.jum_santri_tsn || 0}
                    </td>
                    <td className="border p-2 text-center">
                      {monografi.jum_santri_smp || 0}
                    </td>
                    <td className="border p-2 text-center">
                      {monografi.jum_santri_ma || 0}
                    </td>
                    <td className="border p-2 text-center">
                      <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 justify-center">
                        <Link to={`/jamiyah/detail-jamiyah/${data_jamiyah.id_master_jamaah}`}>
                          <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center justify-center w-full sm:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                          </button>
                        </Link>

                        <Link to={`/jamiyah/edit-jamiyah/${data_jamiyah.id_master_jamaah}`}>
                          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center justify-center w-full sm:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(data_jamiyah.id_master_jamaah)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center justify-center w-full sm:w-auto"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="17" className="text-center border p-4">
                  Tidak ada data Jamiyah.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}

      {/* Pagination Buttons - Made responsive */}
      <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white font-semibold text-sm transition ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          ← Prev
        </button>

        <span className="text-sm font-medium">
          Halaman {page} dari {Math.ceil(total / perPage)}
        </span>

        <button
          onClick={() =>
            setPage((prev) =>
              prev < Math.ceil(total / perPage) ? prev + 1 : prev
            )
          }
          disabled={
            page >= Math.ceil(total / perPage) || jamiyah.length < perPage
          }
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white font-semibold text-sm transition ${
            page >= Math.ceil(total / perPage) || jamiyah.length < perPage
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default DataMonografi;