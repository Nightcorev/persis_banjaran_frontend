import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DataMonografi = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const jamiyah = [
    {
      id_master_jamaah: 1,
      nama_jamaah: "BANJARAN",
      nama_lengkap: "HELMI SOFYAN",
      tgl_pelaksanaan: "16 Dec 2023",
      tgl_akhir_jihad: "16 Dec 2026",
      jml_persis: "53",
      jml_persistri: "47",
      jml_pemuda: "62",
      jml_pemudi:"49",
      jml_mubaligh:"52",
      jml_asatidz:"33",
      jml_ra:"10",
      jml_md:"11",
      jml_mi:"31",
      jml_tsn:"22",
      jml_smp:"35",
      jml_ma:"11"
    },
  ];

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
            placeholder="Cari data..."
            className="border p-2 rounded"
          />
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto max-h-[65vh] border rounded-lg text-sm">
        <table className="table-auto w-full border-collapse border border-gray-300 text-black">
          <thead className="bg-gray-200">
          <>
            <tr>
                <th rowspan="2">No</th>
                <th rowspan="2">Nama Jama'ah</th>
                <th rowspan="2">Ketua PJ</th>
                <th rowspan="2">Tanggal Musjam</th>
                <th rowspan="2">Akhir Masa Jihad</th>
                <th colspan="4"><center>Jumlah Anggota</center></th>
                <th rowspan="2"><center>Mubaligh</center></th>
                <th rowspan="2"><center>Asatidz</center></th>
                <th colspan="6"><center>Jumlah Santri</center></th>
                <th rowspan="2"><center>Aksi</center></th>
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
                <tr key={data_jamiyah.id_master_jamaah} className="hover:bg-gray-100">
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
                    {data_jamiyah.tgl_akhir_jihad || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_persis || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_persistri || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_pemuda || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_pemudi || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_mubaligh || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_asatidz || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_ra || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_md || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_mi || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_tsn || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_smp || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {data_jamiyah.jml_ma || "N/A"}
                  </td>
                  
                  <td className="border p-2 text-center space-x-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 items-center justify-centers">
                      <Link to="/jamiyah/detail-jamiyah">
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
                <td colSpan="10" className="text-center border p-4">
                  Tidak ada data Jamiyah.
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

export default DataMonografi;
