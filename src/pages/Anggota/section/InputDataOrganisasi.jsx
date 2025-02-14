// InputDataOrganisasi.jsx
import React, { useState } from "react";
import Modal from "../../../components/Modal";

const InputDataOrganisasi = ({ nomorAnggota }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [organisasi, setOrganisasi] = useState({
    namaOrganisasi: "",
    tingkat: "",
    jabatan: "",
    tahunMulai: "",
    tahunSelesai: "",
  });

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrganisasi({
      ...organisasi,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(organisasi);
    handleClosePopup();
  };

  return (
    <div>
      <div className="flex items-center gap-2">
          <label className="text-xs">Nomor Anggota</label>
          <input
          type="text"
          className="w-sm p-2 border rounded-md text-xs"
          value={nomorAnggota}
          disabled
          />
      </div>

      <div className="flex flex-row-reverse">
        <button
          onClick={handleOpenPopup}
          className="py-2 px-4 bg-green-600 text-white rounded-md mt-4 text-sm"
        >
          Tambah Data Organisasi
        </button>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border text-xs">No</th>
              <th className="py-2 px-4 border text-xs">Nama Organisasi</th>
              <th className="py-2 px-4 border text-xs">Tingkat</th>
              <th className="py-2 px-4 border text-xs">Jabatan</th>
              <th className="py-2 px-4 border text-xs">Tahun Mulai</th>
              <th className="py-2 px-4 border text-xs">Tahun Selesai</th>
              <th className="py-2 px-4 border text-xs">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Tabel kosong, siap diisi nanti */}
          </tbody>
        </table>
      </div>

      {/* Gunakan Modal dengan title dinamis */}
      <Modal isOpen={isPopupOpen} onClose={handleClosePopup} title="Input Data Organisasi">
        <form onSubmit={handleSubmit}>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs">Nama Organisasi</label>
            <input
              type="text"
              name="namaOrganisasi"
              value={organisasi.namaOrganisasi}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-xs"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs">Tingkat</label>
            <input
              type="text"
              name="tingkat"
              value={organisasi.tingkat}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-xs"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs">Jabatan</label>
            <input
              type="text"
              name="jabatan"
              value={organisasi.jabatan}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-xs"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs">Tahun Mulai</label>
            <input
              type="number"
              name="tahunMulai"
              value={organisasi.tahunMulai}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-xs"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs">Tahun Selesai</label>
            <input
              type="number"
              name="tahunSelesai"
              value={organisasi.tahunSelesai}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-xs"
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={handleClosePopup}
              className="px-4 py-2 bg-gray-300 text-xs rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white text-xs rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InputDataOrganisasi;
