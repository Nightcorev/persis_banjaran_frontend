import React, { useState } from "react";

const AnggotaTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const anggotas = [
    {
      id_anggota: 1,
      foto: "1.jpg",
      nik: "123456",
      nama_lengkap: "MAMAY SOMANTRI",
      tanggal_lahir: "1963-08-15",
      pendidikan: "SMA",
      nama_pekerjaan: "Guru",
      status_aktif: 2,
    },
    {
      id_anggota: 2,
      foto: "2.jpg",
      nik: "789012",
      nama_lengkap: "AHMAD FAHMI",
      tanggal_lahir: "1980-03-21",
      pendidikan: "S1",
      nama_pekerjaan: "Pengusaha",
      status_aktif: 1,
    },
  ];

  const formatTanggal = (tanggal) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(tanggal).toLocaleDateString("id-ID", options);
  };

  const filteredAnggotas = anggotas.filter((anggota) =>
    anggota.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAnggotas.length / perPage);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Data Anggota</h2>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari anggota..."
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Tabel Anggota */}
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
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnggotas.length > 0 ? (
              filteredAnggotas
                .slice((page - 1) * perPage, page * perPage)
                .map((anggota, index) => (
                  <tr key={anggota.id_anggota} className="hover:bg-gray-100">
                    <td className="border p-2 text-center">
                      {(page - 1) * perPage + index + 1}
                    </td>
                    <td className="border p-2 text-center">
                      <img
                        src={`/media/images/anggota/${anggota.foto}`}
                        alt="Foto Anggota"
                        className="w-12 h-12 rounded-full object-cover mx-auto"
                      />
                    </td>
                    <td className="border p-2 text-center">{anggota.nik}</td>
                    <td className="border p-2 text-center">{anggota.nama_lengkap}</td>
                    <td className="border p-2 text-center">{formatTanggal(anggota.tanggal_lahir)}</td>
                    <td className="border p-2 text-center">{anggota.pendidikan}</td>
                    <td className="border p-2 text-center">{anggota.nama_pekerjaan}</td>
                    <td className="border p-2 text-center">
                      {anggota.status_aktif === 1
                        ? "Aktif"
                        : anggota.status_aktif === 2
                        ? "Meninggal"
                        : anggota.status_aktif === 3
                        ? "Mutasi"
                        : "Tidak Diketahui"}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center border p-4">
                  Tidak ada data anggota.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Halaman {page} dari {totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AnggotaTab;
