// InputDataTraining.jsx
import React, { useState } from "react";
import Modal from "../../../components/Modal";

const InputDataTraining = ({ nomorAnggota }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [training, setTraining] = useState({
    namaTraining: "",
    tempat: "",
    tanggal: "",
  });

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTraining({
      ...training,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(training);
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
        Tambah Data Training
      </button>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border text-xs">No</th>
              <th className="py-2 px-4 border text-xs">Nama Training</th>
              <th className="py-2 px-4 border text-xs">Tempat</th>
              <th className="py-2 px-4 border text-xs">Tanggal</th>
              <th className="py-2 px-4 border text-xs">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Tabel kosong, siap diisi nanti */}
          </tbody>
        </table>
      </div>

      {/* Gunakan Modal dengan title dinamis */}
      <Modal isOpen={isPopupOpen} onClose={handleClosePopup} title="Input Data Pendidikan">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-xs">Nama Training</label>
            <input
              type="text"
              name="namaTraining"
              value={training.namaTraining}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-xs"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs">Tempat</label>
            <input
              type="text"
              name="tempat"
              value={training.tempat}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-xs"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs">Tanggal</label>
            <input
              type="number"
              name="tanggal"
              value={training.tanggal}
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

export default InputDataTraining;
