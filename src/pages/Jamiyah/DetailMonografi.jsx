import { useState } from "react";
import { Link } from "react-router-dom";

const DetailMonografi = () => {
    const [activeTab, setActiveTab] = useState("musyawarah");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total ] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const musyawarahs = [
        {
          id_musyawarah: 1,
          tanggal_musjam: "2023-12-19",
          nama_lengkap: "HELMI SOFYAN",
          tgl_akhir_jihad: "2026-12-16",
        },
      ];

      const formatTanggal = (tanggal) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(tanggal).toLocaleDateString("id-ID", options);
      };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">PJ PERSIS BANJARAN</h1>
        <div className="grid grid-cols-2 gap-6">
          {/* Card Section */}
          <div className="bg-gray-300 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold">HELMI SOFYAN</h2>
                <p className="text-sm">KETUA</p>
              </div>
              <div className="bg-gray-400 rounded-full h-20 w-20 mt-5 mr-5"></div>
            </div>
            <br></br>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center justify-center bg-gray-500 h-12 rounded-lg text-white">53 <br></br>PERSIS</div>
              <div className="flex items-center justify-center bg-gray-500 h-12 rounded-lg text-white">47<br></br>PERSISTRI</div>
              <div className="flex items-center justify-center bg-gray-500 h-12 rounded-lg text-white">62<br></br>PEMUDA</div>
              <div className="flex items-center justify-center bg-gray-500 h-12 rounded-lg text-white">49<br></br>PEMUDI</div>
            </div>
          </div>

          {/* Jamaah Info Section */}
          <div className="bg-gray-300 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-1">NAMA JAMAAH</h2>
            <p className="mb-2">BANJARAN</p>
            <h2 className="text-lg font-bold mb-1">NOMOR JAMAAH</h2>
            <p className="mb-2">1</p>
            <h2 className="text-lg font-bold mb-1">ALAMAT</h2>
            <p>Jl.Pajagalan 115 Ds.Banjaran Kec.Banjaran Kab.Bandung</p>
          </div>
        </div>

        <div className="p-4">
        {/* Tabs Header */}
        <div className="flex space-x-3">
          {[
            { id: "musyawarah", label: "Musyawarah Jamaah" },
            { id: "anggota", label: "Anggota" },
            { id: "pesantren", label: "Pesantren" },
            { id: "wakaf", label: "Wakaf" },
            { id: "fasilitas", label: "Fasilitas" },
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
        {activeTab === "musyawarah" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 ">Data Musyawarah</h2>
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
                    placeholder="Cari musyawarah..."
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
                      <th className="border p-2">Tanggal Musjam</th>
                      <th className="border p-2">Ketua Terpilih</th>
                      <th className="border p-2">Habis Masa Jihad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {musyawarahs.length > 0 ? (
                      musyawarahs.map((musyawarah, index) => (
                        <tr
                          key={musyawarah.id_musyawarah}
                          className="hover:bg-gray-100"
                        >
                          <td className="border p-2 text-center">
                            {(page - 1) * perPage + index + 1}
                          </td>

                          <td className="border p-2 text-center">
                            {formatTanggal(musyawarah.tanggal_musjam)}
                          </td>
                          <td className="border p-2 text-center">
                            {musyawarah.nama_lengkap}
                          </td>

                          <td className="border p-2 text-center">
                            {formatTanggal(musyawarah.tgl_akhir_jihad)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center border p-4">
                          Tidak ada data musyawarah.
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
        </div>
    </div>
    </div>
  );
};

export default DetailMonografi;
