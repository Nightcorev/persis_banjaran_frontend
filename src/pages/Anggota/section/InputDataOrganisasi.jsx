import React, { useState } from "react";
import Modal from "../../../components/Modal";

const InputDataOrganisasi = ({ data = [], onDataChange, nomorAnggota }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [organisasi, setOrganisasi] = useState({
    namaOrganisasi: "",
    tingkat: "",
    jabatan: "",
    tahunMulai: "",
    tahunSelesai: "",
  });

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrganisasi((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onDataChange([...data, organisasi]);
    setOrganisasi({
      namaOrganisasi: "",
      tingkat: "",
      jabatan: "",
      tahunMulai: "",
      tahunSelesai: "",
    });
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

      <div className="flex flex-row-reverse mt-2">
        <button
          onClick={handleOpenPopup}
          className="py-2 px-4 bg-green-600 text-white rounded-md text-sm"
        >
          Tambah Organisasi
        </button>
      </div>

      <div className="overflow-x-auto mt-2">
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
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border text-xs">{index + 1}</td>
                  <td className="py-2 px-4 border text-xs">{item.namaOrganisasi}</td>
                  <td className="py-2 px-4 border text-xs">{item.tingkat}</td>
                  <td className="py-2 px-4 border text-xs">{item.jabatan}</td>
                  <td className="py-2 px-4 border text-xs">{item.tahunMulai}</td>
                  <td className="py-2 px-4 border text-xs">{item.tahunSelesai}</td>
                  <td className="py-2 px-4 border text-xs">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => {
                        const newData = data.filter((_, i) => i !== index);
                        onDataChange(newData);
                      }}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-2 px-4 text-center text-xs">
                  Data organisasi kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isPopupOpen} onClose={handleClosePopup} title="Input Data Organisasi">
      <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-xs">Tingkat</label>
            <input
              type="text"
              name="tingkat"
              value={pendidikan.tingkat}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-xs"
              required
            />
          </div>

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

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs">Jurusan</label>
            <input
              type="text"
              name="jurusan"
              value={pendidikan.jurusan}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-xs"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs">Tahun Masuk</label>
            <input
              type="number"
              name="tahunMasuk"
              value={pendidikan.tahunMasuk}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-xs"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs">Tahun Keluar</label>
            <input
              type="number"
              name="tahunKeluar"
              value={pendidikan.tahunKeluar}
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
