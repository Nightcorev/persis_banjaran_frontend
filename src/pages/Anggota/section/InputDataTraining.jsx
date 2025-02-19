import React, { useState } from "react";
import Modal from "../../../components/Modal";

const InputDataTraining = ({ data = [], onDataChange, nomorAnggota }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [training, setTraining] = useState({
    namaTraining: "",
    tempat: "",
    tanggal: "",
  });

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTraining((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onDataChange([...data, training]);
    setTraining({
      namaTraining: "",
      tempat: "",
      tanggal: "",
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
          Tambah Training
        </button>
      </div>

      <div className="overflow-x-auto mt-2">
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
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border text-xs">{index + 1}</td>
                  <td className="py-2 px-4 border text-xs">{item.namaTraining}</td>
                  <td className="py-2 px-4 border text-xs">{item.tempat}</td>
                  <td className="py-2 px-4 border text-xs">{item.tanggal}</td>
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
                <td colSpan="5" className="py-2 px-4 text-center text-xs">
                  Data training kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isPopupOpen} onClose={handleClosePopup} title="Input Data Training">
        <form onSubmit={handleSubmit}>
          {["Nama Training", "Tempat", "Tanggal"].map((label, idx) => (
            <div key={idx} className="flex flex-col gap-2 mt-2">
              <label className="text-xs">{label}</label>
              <input
                type={label === "Tanggal" ? "date" : "text"}
                name={label.toLowerCase().replace(" ", "")}
                value={training[label.toLowerCase().replace(" ", "")]}
                onChange={handleInputChange}
                className="p-2 border rounded-md text-xs"
                required
              />
            </div>
          ))}
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
