import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DetailDataPesantren = () => {
  const [activeTab, setActiveTab] = useState("struktur");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const asatidzs = [
    {
      id_asatidz: 1,
      nama_lengkap: "Abdul Abdurahman N",
      jenis_kelamin: "pria",
      tanggal_lahir: "1995-9-17",
      pendidikan: "S1",
      jabatan: "Mudir",
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
          to="/pendidikan/data-pesantren"
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
        <h1 className="text-4xl font-bold ml-4">Detail Data Pesantren</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-wrap gap-6 p-4">
        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-3xl p-4 text-center ">
          <div className="w-64 h-80 bg-gray-300 flex items-center justify-center rounded-md mx-auto">
            <span className="text-gray-500">Foto</span>
          </div>
          <p className="font-bold text-lg mt-4">Abdul Mutakir</p>
          <p className="text-gray-600 ">Mudir</p>
        </div>

        {/* Statistics & Details */}
        <div className="flex-1 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-6 bg-white rounded-3xl shadow-lg flex items-center">
              <h3 className="text-6xl font-semibold mr-4">103</h3>
              <p className="text-2xl font-bold">Santri</p>
            </div>
            <div className="p-6 bg-white rounded-3xl shadow-lg flex items-center">
              <h3 className="text-6xl font-semibold mr-4">10</h3>
              <p className="text-2xl font-bold">Asatidz</p>
            </div>
          </div>

          {/* Detail Information */}
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1 ">
                <p className="font-bold">Nama Pesantren</p>
                <p>PPI 351 Girangdeukeut</p>
              </div>
              <div className="col-span-3 ">
                <p className="font-bold">Alamat</p>
                <p>Jl. Ciapus No.53 Ds. Banjaran Kec. Banjaran Kab. Bandung</p>
              </div>
              <div>
                <p className="font-bold ">Tingkat</p>
                <p>Madrasah Diniyyah</p>
              </div>
              <div>
                <p className="font-bold ">Nomor Kontak</p>
                <p>088218486116</p>
              </div>
              <div>
                <p className="font-bold ">Luas Tanah</p>
                <p>200 m²</p>
              </div>
              <div>
                <p className="font-bold ">Status Tanah</p>
                <p>Legal</p>
              </div>
              <div>
                <p className="font-bold ">Nomor Pesantren</p>
                <p>351</p>
              </div>
              <div>
                <p className="font-bold ">Tahun Berdiri</p>
                <p>2003</p>
              </div>
              <div className="col-span-2 ">
                <p className="font-bold">Luas Bangunan</p>
                <p>100 m²</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        {/* Tabs Header */}
        <div className="flex space-x-2">
          {[
            { id: "struktur", label: "Struktur Kepengurusan" },
            { id: "asatidz", label: "Data Asatidz" },
            { id: "santri", label: "Data Santri" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-t-lg font-medium ${
                activeTab === tab.id ? "bg-white" : "bg-gray-500 text-white"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div className="p-6 bg-white rounded-b-3xl shadow-md">
          {activeTab === "struktur" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Struktur Kepengurusan</h2>
              <div className="flex mt-4">
                <p className="pr-4 font-bold">Mudir</p>
                <div className="pl-4">Abdul Mutakir</div>
              </div>
            </div>
          )}
          {activeTab === "asatidz" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 ">Data Asatidz</h2>
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
                    placeholder="Cari asatidz..."
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
                      <th className="border p-2">Nama Lengkap</th>
                      <th className="border p-2">Jenis Kelamin</th>

                      <th className="border p-2">Tanggal Lahir</th>

                      <th className="border p-2">Pendidikan</th>
                      <th className="border p-2">Jabatan</th>
                      <th className="border p-2">Nomor SK</th>
                      <th className="border p-2">TMT</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asatidzs.length > 0 ? (
                      asatidzs.map((asatidz, index) => (
                        <tr
                          key={asatidz.id_asatidz}
                          className="hover:bg-gray-100"
                        >
                          <td className="border p-2 text-center">
                            {(page - 1) * perPage + index + 1}
                          </td>

                          <td className="border p-2 text-center">
                            {asatidz.nama_lengkap}
                          </td>
                          <td className="border p-2 text-center">
                            {asatidz.jenis_kelamin}
                          </td>

                          <td className="border p-2 text-center">
                            {formatTanggal(asatidz.tanggal_lahir)}
                          </td>
                          <td className="border p-2 text-center">
                            {asatidz.pendidikan || "N/A"}
                          </td>
                          <td className="border p-2 text-center">
                            {asatidz.jabatan || "N/A"}
                          </td>
                          <td className="border p-2 text-center">
                            {asatidz.no_sk || "N/A"}
                          </td>
                          <td className="border p-2 text-center">
                            {formatTanggal(asatidz.tmt)}
                          </td>
                          <td className="border p-2 text-center ">
                            <div className=" inline-block space-y-1">
                              {/* Tombol Detail */}
                              <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center">
                                <Link
                                  to="/pendidikan/detail-asatidz"
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
                        <td colSpan="9" className="text-center border p-4">
                          Tidak ada data asatidz.
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
          )}
          {activeTab === "santri" && (
            <div>
              <h2 className="text-2xl font-bold ">Data Santri</h2>
              <p className="mt-2">Informasi tentang para santri</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailDataPesantren;
