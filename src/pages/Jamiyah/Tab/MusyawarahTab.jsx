import React, { useState } from "react";

const MusyawarahTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

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

  const filteredMusyawarahs = musyawarahs.filter((musyawarah) =>
    musyawarah.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Data Musyawarah</h2>
      <SearchAndFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
            {filteredMusyawarahs.length > 0 ? (
              filteredMusyawarahs.map((musyawarah, index) => (
                <tr key={musyawarah.id_musyawarah} className="hover:bg-gray-100">
                  <td className="border p-2 text-center">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td className="border p-2 text-center">{formatTanggal(musyawarah.tanggal_musjam)}</td>
                  <td className="border p-2 text-center">{musyawarah.nama_lengkap}</td>
                  <td className="border p-2 text-center">{formatTanggal(musyawarah.tgl_akhir_jihad)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center border p-4">
                  Tidak ada data musyawarah.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SearchAndFilter = ({ searchTerm, setSearchTerm }) => (
  <div className="mb-4 flex justify-between items-center">
    <div className="flex items-center text-sm">
      <label htmlFor="search" className="mr-2">
        Cari:
      </label>
      <input
        id="search"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Cari musyawarah..."
        className="border p-2 rounded"
      />
    </div>
  </div>
);

export default MusyawarahTab;
