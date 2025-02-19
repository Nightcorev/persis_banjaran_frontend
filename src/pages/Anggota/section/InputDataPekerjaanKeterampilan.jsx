import React, { useState } from "react";
import Modal from "../../../components/Modal";

const InputDataPekerjaanKeterampilan = ({ data, onDataChange, nomorAnggota }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // Pastikan data memiliki struktur yang benar
  const pekerjaan = data.pekerjaan || { pekerjaan: "", lainnya: "" };
  const tabelKeterampilan = data.keterampilan || [];

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "pekerjaan" || name === "lainnyaPekerjaan") {
      onDataChange({
        ...data,
        pekerjaan: {
          ...pekerjaan,
          [name === "pekerjaan" ? "pekerjaan" : "lainnya"]: value,
        },
      });
    }
  };

  const handleSubmitKeterampilan = (e) => {
    e.preventDefault();

    const keterampilanBaru = e.target.keterampilan.value === "Lainnya"
      ? e.target.lainnya.value
      : e.target.keterampilan.value;

    onDataChange({
      ...data,
      keterampilan: [...tabelKeterampilan, { keterampilan: keterampilanBaru }],
    });

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

      <div className="flex items-center gap-4">
        <label className="text-xs">Pekerjaan</label>
        <select
          className="w-sm p-2 border rounded-md text-xs"
          name="pekerjaan"
          value={pekerjaan.pekerjaan}
          onChange={handleInputChange}
        >
          <option value="">Pilih Pekerjaan</option>
          <option value="TNI">TNI</option>
          <option value="Wirausaha">Wirausaha</option>
          <option value="Lainnya">Lainnya</option>
        </select>

        {pekerjaan.pekerjaan === "Lainnya" && (
          <div className="flex items-center gap-2">
            <label className="text-xs">Lainnya</label>
            <input
              type="text"
              name="lainnyaPekerjaan"
              value={pekerjaan.lainnya}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-xs"
            />
          </div>
        )}
      </div>

      <div className="flex flex-row-reverse">
        <button onClick={handleOpenPopup} className="py-2 px-4 bg-green-600 text-white rounded-md mt-4 text-sm">
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
            {tabelKeterampilan.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border text-xs">{index + 1}</td>
                <td className="py-2 px-4 border text-xs">{item.keterampilan}</td>
                <td className="py-2 px-4 border text-xs">
                  <button
                    className="text-red-600"
                    onClick={() => {
                      const updatedTabel = tabelKeterampilan.filter((_, i) => i !== index);
                      onDataChange({ ...data, keterampilan: updatedTabel });
                    }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isPopupOpen} onClose={handleClosePopup} title="Input Data Keterampilan">
        <form onSubmit={handleSubmitKeterampilan}>
          <div className="flex flex-col gap-2">
            <label className="text-xs">Keterampilan</label>
            <select name="keterampilan" className="p-2 border rounded-md text-xs" required>
              <option value="">Pilih Keterampilan</option>
              <option value="Memasak">Memasak</option>
              <option value="Mengemudi">Mengemudi</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={handleClosePopup} className="px-4 py-2 bg-gray-300 text-xs rounded-md">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white text-xs rounded-md">
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InputDataPekerjaanKeterampilan;
