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
              <div className="col-span-1 my-2">
                <p className="font-bold">Nama Pesantren</p>
                <p>PPI 351 Girangdeukeut</p>
              </div>
              <div className="col-span-3 my-2">
                <p className="font-bold">Alamat</p>
                <p>Jl. Ciapus No.53 Ds. Banjaran Kec. Banjaran Kab. Bandung</p>
              </div>
              <div>
                <p className="font-bold my-2">Tingkat</p>
                <p>Madrasah Diniyyah</p>
              </div>
              <div>
                <p className="font-bold my-2">Nomor Kontak</p>
                <p>088218486116</p>
              </div>
              <div>
                <p className="font-bold my-2">Luas Tanah</p>
                <p>200 m²</p>
              </div>
              <div>
                <p className="font-bold my-2">Status Tanah</p>
                <p>Legal</p>
              </div>
              <div>
                <p className="font-bold my-2">Nomor Pesantren</p>
                <p>351</p>
              </div>
              <div>
                <p className="font-bold my-2">Tahun Berdiri</p>
                <p>2003</p>
              </div>
              <div className="col-span-2 my-2">
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
                          <td className="border p-2 text-center space-x-2">
                            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 items-center justify-centers">
                              <Link to="/pendidikan/detail-asatidz">
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
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                  />
                                </svg>
                              </Link>
                            </button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 items-center justify-centers">
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
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </button>
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
