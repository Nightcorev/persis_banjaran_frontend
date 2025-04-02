import React, { useEffect, useState } from "react";
import axios from "axios";

const DataAnggota = () => {
  const [users, setUsers] = useState([]);
  const baseUrl = "http://127.0.0.1:8000";
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Memanggil API dengan parameter pencarian dan pagination
        const response = await axios.get(
          `http://127.0.0.1:8000/api/anggota?page=${page}&perPage=${perPage}&searchTerm=${searchTerm}`
        );
        setUsers(response.data.data.data);
        setTotal(response.data.data.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Matikan loading setelah fetch selesai
      }
    };

    fetchData();
  }, [page, perPage, searchTerm]); // Menambahkan searchTerm sebagai dependensi

  const handleDelete = async (id_anggota) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus anggota ini?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/delete_anggota/${id_anggota}`);
      setUsers(users.filter(user => user.id_anggota !== id_anggota));
      alert("Data anggota berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Gagal menghapus anggota.");
    }
  };

  // Fungsi format tanggal lahir
  const formatTanggal = (tanggal) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(tanggal).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Data Anggota</h1>
        <a href="/users/data-anggota/add-anggota">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-gray-500">
            + Tambah Anggota
          </button>
        </a>
      </div>
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
            placeholder="Cari anggota..."
            className="border p-2 rounded"
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

      {/* Tabel Data */}
      {!loading && (
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
                <th className="border p-2">Jamaah</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id_anggota} className="hover:bg-gray-100">
                    <td className="border p-2 text-center">
                      {(page - 1) * perPage + index + 1}
                    </td>
                    <td className="border p-2 text-center">
                      {/* <img
                      src={`${baseUrl}/public/uploads/${user.foto}`}
                      alt="Foto User"
                      className="w-12 h-12 object-cover rounded-full mx-auto"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/50")
                      }
                    /> */}
                    </td>
                    <td className="border p-2 text-center">{user.nik}</td>
                    <td className="border p-2">{user.nama_lengkap}</td>
                    <td className="border p-2 text-center">
                      {formatTanggal(user.tanggal_lahir)}
                    </td>
                    <td className="border p-2">{user.pendidikan || "N/A"}</td>
                    <td className="border p-2">
                      {user.nama_pekerjaan || "N/A"}
                    </td>
                    <td className="border p-2">{user.nama_jamaah || "N/A"}</td>
                    <td
                      className={`border p-2 text-center ${
                        user.status_aktif === 1
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {user.status_aktif === 1 ? "Aktif" : "Tidak Aktif"}
                    </td>
                    <td className="border p-2 text-center space-x-2">
                      <a href={`/users/data-anggota/view-anggota/${user.id_anggota}`}>
                      <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-blue-600 items-center justify-centers">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </button>
                      </a>
                      
                      <a href={`/users/data-anggota/edit-anggota/${user.id_anggota}`}>
                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 items-center justify-centers">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-4"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>
                      </a>

                      <button
                        onClick={() => handleDelete(user.id_anggota)} 
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 items-center justify-centers">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center border p-4">
                    Tidak ada data anggota.
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
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Halaman {page} dari {Math.ceil(total / perPage)}
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

export default DataAnggota;
