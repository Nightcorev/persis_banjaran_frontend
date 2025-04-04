import React, { useState, useEffect } from "react";
import Modal from "../../../components/Modal";
import api from "../../../utils/api";

const InputDataMinat = ({ data = [], onDataChange, nomorAnggota }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [minatChoice, setMinatChoice] = useState([]);
  const [minat, setMinat] = useState({
    minat: "",
    minatLainnya: "",
  });

  useEffect(() => {
    api.get("/data_choice_minat")
      .then((response) => setMinatChoice(response.data.minat || []))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMinat((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onDataChange([...data, minat]);
    setMinat({
      minat: "",
      minatLainnya: "",
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
          Tambah Minat
        </button>
      </div>

      <div className="overflow-x-auto mt-2">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border text-xs">No</th>
              <th className="py-2 px-4 border text-xs">Nama Minat</th>
              <th className="py-2 px-4 border text-xs">Lainnya</th>
              <th className="py-2 px-4 border text-xs">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border text-xs">{index + 1}</td>
                  <td className="py-2 px-4 border text-xs">{item.minat}</td>
                  <td className="py-2 px-4 border text-xs">{item.minatLainnya}</td>
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
                <td colSpan="4" className="py-2 px-4 text-center text-xs">
                  Data minat kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isPopupOpen} onClose={handleClosePopup} title="Input Data Minat">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs">Minat</label>
            <select
              name="minat"
              value={minat.minat}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-xs"
              required
            >
              <option value="">-- Silahkan Pilih --</option>
              {minatChoice.map((item) => (
                <option key={item.id_master_minat} value={item.nama_minat}>
                  {item.nama_minat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs">Lainnya</label>
            <input
              type="text"
              name="minatLainnya"
              value={minat.minatLainnya}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-xs"
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

export default InputDataMinat;
