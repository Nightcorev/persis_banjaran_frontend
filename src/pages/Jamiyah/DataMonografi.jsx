import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../utils/api";

const DataMonografi = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [jamiyah, setJamiyah] = useState([]); // State untuk menyimpan data dari API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
  const account = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/data_jamaah?page=${page}&perPage=${perPage}&search=${searchTerm}`
      );
      setJamiyah(response.data.data.data); // Update state dengan data dari API
      setTotal(response.data.data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Gagal mengambil data, coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect untuk memanggil fetchData saat page, perPage, atau searchTerm berubah
  useEffect(() => {
    fetchData();
  }, [page, perPage, searchTerm]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-lg font-bold mb-4">Data Jamaah</h1>

      {/* Pencarian dan Dropdown untuk memilih perPage */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center text-sm">
          <label className="mr-2">Tampilkan:</label>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border p-2 rounded"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="ml-2">data per halaman</span>
        </div>

        {/* Input Pencarian */}
        <div className="flex items-center text-sm">
          <label htmlFor="search" className="mr-2">
            Cari:
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
            placeholder="Cari data..."
            className="border p-2 rounded"
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center my-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500"></div>
          <span className="ml-3 text-gray-600">Memuat data...</span>
        </div>
      )}
      
      {/* Tabel Data */}
      {!loading && (
      <div className="overflow-x-auto max-h-[65vh] border rounded-lg text-sm">
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
              jamiyah.map((data_jamiyah, index) => (
                <tr
                  key={data_jamiyah.id_master_jamaah}
                  className="hover:bg-gray-100"
                >
                  <td className="border p-2 text-center">
                    {(page - 1) * perPage + index + 1}
                  </td>

                  <td className="border p-2 text-center">
                    {data_jamiyah.nama_jamaah}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.nama_lengkap}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.tgl_pelaksanaan}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.tgl_akhir_jihad}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_persis}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_persistri}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_pemuda}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_pemudi}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_mubaligh}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_asatidz}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_ra}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_md}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_mi}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_tsn}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_smp}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_ma}
                  </td>

                  <td className="border p-2 text-center">
                    {/* Tombol Detail, Edit & Delete */}
                    <div className=" inline-block space-y-1">
                      {/* Tombol Detail */}
                      <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center">
                        <Link
                          to={`/jamiyah/detail-jamiyah/${data_jamiyah.id_master_jamaah}`}
                          className="flex items-center gap-4"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5"
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
                          Lihat
                        </Link>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center border p-4">
                  Tidak ada data Jamiyah.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}

      {/* Pagination Buttons */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
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
          className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
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
