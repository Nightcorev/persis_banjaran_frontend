import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const KelolaAkun = () => {
  //const [akuns, setakun] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [selectedType, setSelectedType] = useState("");
  const [showModalAdd, setShowModalAdd] = useState(false);
  const handleDelete = () => {
    setShowModal(false);
  };

  const akuns = [
    {
      id_akun: 1,
      nama_lengkap: "Abdul Abdurahman N",
      username: "122.658",
      role: "pria",
    },
  ];

  const roles = [
    {
      nama_jenis: "Tambah",
      value_jenis: "add",
    },
    {
      nama_jenis: "Lihat",
      value_jenis: "show",
    },
    {
      nama_jenis: "Edit",
      value_jenis: "edit",
    },
    {
      nama_jenis: "Hapus",
      value_jenis: "delete",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tambahkan logika penyimpanan data di sini
    console.log("Roles:", selectedType);
    setShowModalAdd(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-lg font-bold mb-4">Kelola Akun</h1>

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
            placeholder="Cari akun..."
            className="border p-2 rounded"
          />
          <div className="flex items-center text-sm ml-10 font-bold">
            <button
              className=" px-4 py-2 bg-green-600  rounded-lg text-white"
              onClick={() => setShowModalAdd(true)}
            >
              Tambah Akun
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto max-h-[65vh] border rounded-lg text-sm">
        <table className="table-auto w-full border-collapse border border-gray-300 text-black">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">No</th>
              <th className="border p-2">Nama Lengkap</th>
              <th className="border p-2">Username</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {akuns.length > 0 ? (
              akuns.map((akun, index) => (
                <tr key={akun.id_akun} className="hover:bg-gray-100">
                  <td className="border p-2 text-center">
                    {(page - 1) * perPage + index + 1}
                  </td>

                  <td className="border p-2 ">{akun.nama_lengkap}</td>
                  <td className="border p-2 text-center">{akun.username}</td>
                  <td className="border p-2 text-center">{akun.role}</td>

                  <td className="border p-2 text-center">
                    {/* Tombol Detail, Edit & Delete */}
                    <div className=" inline-block space-y-1">
                      {/* Tombol Edit */}
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex gap-6 items-center"
                        onClick={() => setShowModalAdd(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                        Edit
                      </button>

                      {/* Tombol Delete */}
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-2"
                        onClick={() => setShowModal(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                        Hapus
                      </button>
                    </div>

                    {/* Modal Konfirmasi Hapus */}
                    {showModal && (
                      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96">
                          <h2 className="text-lg font-semibold text-gray-800">
                            Konfirmasi Hapus
                          </h2>
                          <p className=" text-gray-600 mt-2">
                            Apakah Anda yakin ingin menghapus item ini?
                          </p>
                          <div className="mt-4 flex justify-end space-x-3">
                            <button
                              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                              onClick={() => setShowModal(false)}
                            >
                              Batal
                            </button>
                            <button
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                              onClick={handleDelete}
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Modal Add Data */}
                    {showModalAdd && (
                      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                          <h2 className="text-lg font-semibold mb-4 text-gray-800">
                            Tambah Data
                          </h2>
                          <form onSubmit={handleSubmit}>
                            <div className="mt-4 flex  items-center">
                              <label className="w-1/3 text-start font-semibold text-gray-700">
                                Nama Lengkap
                              </label>
                              <input
                                type="text"
                                className="w-2/3 p-2 border rounded"
                                placeholder="Input nama..."
                              />
                            </div>
                            <div className="mt-4 flex items-center">
                              <label className="w-1/3 text-start font-semibold text-gray-700">
                                Username
                              </label>
                              <input
                                type="text"
                                className="w-2/3 p-2 border rounded"
                                placeholder="Input username..."
                              />
                            </div>
                            <div className="mt-4 flex items-center">
                              <label className="w-1/3 text-start font-semibold text-gray-700">
                                Role
                              </label>
                              <select
                                className="w-2/3 p-2 border rounded"
                                value={selectedType}
                                onChange={(e) =>
                                  setSelectedType(e.target.value)
                                }
                              >
                                <option value="">Pilih Jenis</option>
                                {roles.length > 0 ? (
                                  roles.map((role) => (
                                    <option
                                      key={role.value_jenis}
                                      value={role.value_jenis}
                                    >
                                      {role.nama_jenis}
                                    </option>
                                  ))
                                ) : (
                                  <option value="">Tidak ada Data</option>
                                )}
                              </select>
                            </div>
                            <div className="mt-4 flex justify-end space-x-3">
                              <button
                                type="button"
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setShowModalAdd(false)}
                              >
                                Batal
                              </button>
                              <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                              >
                                Simpan
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center border p-4">
                  Tidak ada data akun.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

export default KelolaAkun;
