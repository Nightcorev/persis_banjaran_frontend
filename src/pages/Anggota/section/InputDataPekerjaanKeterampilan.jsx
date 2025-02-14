// InputDataPekerjaanKeterampilan.jsx
import React, { useState } from "react";
import Modal from "../../../components/Modal";

const InputDataPekerjaanKeterampilan = ({ nomorAnggota }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [keterampilan, setKeterampilan] = useState({
    keterampilan: "",
    lainnya: ""
  });

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPendidikan({
      ...keterampilan,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(keterampilan);
    handleClosePopup();
  };

  return (
    <div>
        <div className="flex items-center gap-2 pb-4">
            <label className="text-xs">Nomor Anggota</label>
            <input
            type="text"
            className="w-sm p-2 border rounded-md text-xs"
            value={nomorAnggota}
            disabled
            />
        </div>
            
        <div className="flex-row space-x-4">
            <label className="text-xs pe-7">Pekerjaan</label>
            <select className="w-sm p-2 pe-10 border rounded-md text-xs">
                <option value="TNI">TNI</option>
                <option value="Wirausaha">Wirausaha</option>
            </select>

            <label className="text-xs">Lainnya</label>
            <input type="text" className="p-2 border rounded-md text-xs" />

            <button className="p-2 bg-green-600 text-white rounded-md text-xs">
                Simpan
            </button>
          </div>


      
      <div className="flex flex-row-reverse">
        <button
          onClick={handleOpenPopup}
          className="py-2 px-4 bg-green-600 text-white rounded-md mt-4 text-sm"
        >
          Tambah Keterampilan
        </button>
      </div>
      

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border text-xs">No</th>
              <th className="py-2 px-4 border text-xs">Keterampilan</th>
              <th className="py-2 px-4 border text-xs">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Tabel kosong, siap diisi nanti */}
          </tbody>
        </table>
      </div>

      {/* Gunakan Modal dengan title dinamis */}
      <Modal isOpen={isPopupOpen} onClose={handleClosePopup} title="Input Data Keterampilan">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-xs">Keterampilan</label>
            <input
              type="text"
              name="tingkat"
              value={keterampilan.keterampilan}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-xs"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs">lainnya</label>
            <input
              type="text"
              name="namaSekolah"
              value={keterampilan.lainnya}
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

export default InputDataPekerjaanKeterampilan;
