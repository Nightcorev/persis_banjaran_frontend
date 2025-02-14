import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DetailDataAsatidz = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const riwayats = [
    {
      id_riwayat: 1,
      nama_pesantren: "PPI 354 Cipaku",
      jabatan: "Mudir",
      mulai_bertugas: "2011-08-01",
      lama_bertugas: "13 tahun 7 bulan",
      status: "1",
      no_sk: "155 /B.3-C.1/J.009/2022",
      tmt: "2022-8-1",
    },
  ];

  const formatTanggal = (tanggal) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(tanggal).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link
          to="/pendidikan/data-asatidz"
          className="text-4xl p-2 hover:bg-gray-200 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </Link>
        <h1 className="text-4xl font-bold ml-4">Detail Data Asatidz</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-wrap gap-6 p-4">
        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-3xl p-4 text-center max-h-fit">
          <div className="w-64 h-80 bg-gray-300 flex items-center justify-center rounded-md mx-auto">
            <span className="text-gray-500">Foto</span>
          </div>
          <p className="font-bold text-lg mt-4">Abdul Mutakir</p>
          <p className="text-gray-600 ">Asatidz</p>
          <div className="flex justify-between mt-2 py-2 border-t-2">
            <p className="font-bold p-1 ">Status Mengajar</p>
            <p className=" rounded-xl  px-2 py-1 bg-green-600 text-white ">
              Aktif
            </p>
          </div>

          <div className="flex justify-between  py-2">
            <p className="font-bold p-1 ">Pendidikan</p>
            <p className=" rounded-xl  px-2 py-1 bg-cyan-600 text-white ">S1</p>
          </div>
        </div>

        {/* Statistics & Details */}
        <div className="flex-1 space-y-8">
          {/* Detail Information */}
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <div className="grid grid-cols-5 gap-2 pb-4">
              <div>
                <p className="font-bold">Nama Lengkap</p>
                <p>Abdul Mutakir</p>
              </div>
              <div>
                <p className="font-bold ">Nomor Anggota</p>
                <p>122.658</p>
              </div>
              <div className="col-span-2 ">
                <p className="font-bold">Alamat</p>
                <p>Jl. Ciapus No.53 Ds. Banjaran Kec. Banjaran Kab. Bandung</p>
              </div>

              <div>
                <p className="font-bold ">Jenis Kelamin</p>
                <p>Pria</p>
              </div>
              <div>
                <p className="font-bold">Tempat,Tanggal Lahir</p>
                <p>Bandung, 17 September 1995</p>
              </div>
              <div>
                <p className="font-bold ">Nomor Telepon/HP</p>
                <p>088218486116</p>
              </div>
              <div>
                <p className="font-bold ">E-mail</p>
                <p>abdul@gmail.com</p>
              </div>
              <div>
                <p className="font-bold ">Pendidikan Trakhir</p>
                <p>S1</p>
              </div>
              <div>
                <p className="font-bold ">Nama Sekolah Terakhir</p>
                <p>universitas</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t-2">
              <h2 className="text-2xl font-bold mb-4 ">Riwayat Penugasan</h2>
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
                    placeholder="Cari..."
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
                      <th className="border p-2">Jabatan</th>
                      <th className="border p-2">Mulai Bertugas</th>
                      <th className="border p-2">Nomor SK</th>
                      <th className="border p-2">TMT</th>
                      <th className="border p-2">Lama Bertugas</th>
                      <th className="border p-2">Status</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riwayats.length > 0 ? (
                      riwayats.map((riwayat, index) => (
                        <tr
                          key={riwayat.id_riwayat}
                          className="hover:bg-gray-100"
                        >
                          <td className="border p-2 text-center">
                            {(page - 1) * perPage + index + 1}
                          </td>

                          <td className="border p-2 text-center">
                            {riwayat.nama_pesantren}
                          </td>
                          <td className="border p-2 text-center">
                            {riwayat.jabatan}
                          </td>

                          <td className="border p-2 text-center">
                            {formatTanggal(riwayat.mulai_bertugas)}
                          </td>
                          <td className="border p-2 text-center">
                            {formatTanggal(riwayat.tmt)}
                          </td>
                          <td className="border p-2 text-center">
                            {riwayat.tmt || "N/A"}
                          </td>
                          <td className="border p-2 text-center">
                            {riwayat.lama_bertugas || "N/A"}
                          </td>
                          <td
                            className={`border p-2 text-center ${
                              riwayat.status === 1
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {riwayat.status === 1 ? "Aktif" : "Tidak Aktif"}
                          </td>
                          <td className="border p-2 text-center ">
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
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="size-5"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                    />
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
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
                        <td colSpan="9" className="text-center border p-4">
                          Tidak ada data Riwayat Penugasan.
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailDataAsatidz;
