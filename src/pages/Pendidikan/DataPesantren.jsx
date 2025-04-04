import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DataPesantren = () => {
  //const [pesantrens, setPesantren] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const pesantrens = [
    {
      id_pesantren: 1,
      nama_pesantren: "PPI 31 Banjaran",
      nomor_pesantren: "31",
      tingkat: "Madrasah Diniyyah",
      nama_mudir: "Ahmad Amanudin",
      jum_santri: 70,
      alamat: "Jl Pajagalan",
      no_kontak: "0821391831",
    },
    {
      id_pesantren: 1,
      nama_pesantren: "PPI 31 Banjaran",
      nomor_pesantren: "31",
      tingkat: "Madrasah Diniyyah",
      nama_mudir: "Ahmad Amanudin",
      jum_santri: 70,
      alamat: "Jl Pajagalan",
      no_kontak: "0821391831",
    },
  ];

  const handleDelete = () => {
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-lg font-bold mb-4">Data Pesantren</h1>

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
            placeholder="Cari pesantren..."
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
              <th className="border p-2">Nama Pesantren</th>
              <th className="border p-2">Nomor</th>
              <th className="border p-2">Tingkat</th>
              <th className="border p-2">Jama'ah</th>
              <th className="border p-2">Mudir</th>
              <th className="border p-2">Asatidz</th>
              <th className="border p-2">Santri</th>
              <th className="border p-2">Alamat</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pesantrens.length > 0 ? (
              pesantrens.map((pesantren, index) => (
                <tr key={pesantren.id_pesantren} className="hover:bg-gray-100">
                  <td className="border p-2 text-center">
                    {(page - 1) * perPage + index + 1}
                  </td>

                  <td className="border p-2 text-center">
                    {pesantren.nama_pesantren}
                  </td>
                  <td className="border p-2 text-center">
                    {pesantren.nomor_pesantren}
                  </td>
                  <td className="border p-2 text-center">
                    {pesantren.tingkat}
                  </td>
                  <td className="border p-2 text-center">
                    {pesantren.jamaah || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {pesantren.nama_mudir || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {pesantren.nama_asatidz || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {pesantren.jum_santri || "N/A"}
                  </td>
                  <td className="border p-2 ">{pesantren.alamat || "N/A"}</td>
                  <td className="border p-2 text-center">
                    {/* Tombol Detail, Edit & Delete */}
                    <div className=" inline-block space-y-1">
                      {/* Tombol Detail */}
                      <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center">
                        <Link
                          to="/pendidikan/detail-pesantren"
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
                      {/* Tombol Edit */}
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center">
                        <Link
                          to="/pendidikan"
                          className="flex items-center gap-6"
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
                        </Link>
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center border p-4">
                  Tidak ada data Pesantren.
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

export default DataPesantren;
