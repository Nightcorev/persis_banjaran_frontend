import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal";

const InputDataPekerjaanKeterampilan = ({ data, onDataChange, nomorAnggota }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedKeterampilan, setSelectedKeterampilan] = useState("");
  const [lainnyaKeterampilan, setLainnyaKeterampilan] = useState("");
  const [pekerjaanChoice, setPekerjaanChoice] = useState([]);
  const [keterampilanChoice, setKeterampilanChoice] = useState([]);

  const pekerjaan = data.pekerjaan || { pekerjaan: "", lainnya: "" };
  const tabelKeterampilan = data.keterampilan || [];

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/data_choice_pekerjaan_keterampilan")
      .then((response) => response.json())
      .then((data) => {
        setPekerjaanChoice(data.pekerjaan);
        setKeterampilanChoice(data.keterampilan);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedKeterampilan(""); // Reset state
    setLainnyaKeterampilan("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onDataChange({
      ...data,
      pekerjaan: {
        ...pekerjaan,
        [name]: value,
      },
    });
  };

  const handleKeterampilanChange = (e) => {
    setSelectedKeterampilan(e.target.value);
  };

  const handleSubmitKeterampilan = (e) => {
    e.preventDefault();

    const keterampilanBaru =
      selectedKeterampilan === "Lainnya" ? lainnyaKeterampilan : selectedKeterampilan;

    if (!keterampilanBaru) return;

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

      <div className="flex items-center gap-4 pb-4">
        <label className="text-xs">Pekerjaan</label>
        <select
          className="w-sm p-2 border rounded-md text-xs"
          name="pekerjaan"
          value={pekerjaan.pekerjaan}
          onChange={handleInputChange}
        >
          <option value="">Pilih Pekerjaan</option>
          {pekerjaanChoice.map((item) => (
            <option key={item.id_master_pekerjaan} value={item.id_master_pekerjaan}>
              {item.nama_pekerjaan}
            </option>
          ))}
        </select>
        {pekerjaan.pekerjaan === "Lainnya" && (
          <div className="flex items-center gap-2">
            <label className="text-xs">Pekerjaan Lainnya</label>
            <input
              type="text"
              name="lainnya"
              value={pekerjaan.lainnya}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-xs"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 pb-4">
        <label className="text-xs">Nama Instansi</label>
        <input
          type="text"
          name="namaInstansi"
          className="w-sm p-2 border rounded-md text-xs"
          value={pekerjaan.namaInstansi || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex items-center gap-4 pb-4">
        <label className="text-xs">Deskripsi Pekerjaan</label>
        <textarea
              className="w-sm p-2 border rounded-md text-xs"
              value={pekerjaan.deskripsiPekerjaan || ""}
              onChange={handleInputChange}
        />
      </div>

      <div className="flex items-center gap-4">
            <label className="text-xs">Pendapatan</label>
            <select
              name="pendapatan"
              className="w-sm p-2 border rounded-md text-xs"
              value={pekerjaan.pendapatan}
              onChange={handleInputChange}
            >
              <option value="">-- Silahkan Pilih</option>
              <option value="Kurang dari  1 juta rupiah">Kurang dari  1 juta rupiah</option>
              <option value="1 juta s.d kurang dari 2 juta rupiah">1 juta s.d kurang dari 2 juta rupiah</option>
              <option value="2 Juta s.d kurang dari 3 juta rupiah">2 Juta s.d kurang dari 3 juta rupiah</option>
              <option value="3 juta s.d kurang dari 4 juta rupiah">3 juta s.d kurang dari 4 juta rupiah</option>
              <option value="Lebih dari 4 juta rupiah">Lebih dari 4 juta rupiah</option>
            </select>
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
            <select
              name="keterampilan"
              className="p-2 border rounded-md text-xs"
              value={selectedKeterampilan}
              onChange={handleKeterampilanChange}
              required
            >
              <option value="">-- Silahkan Pilih</option>
              {keterampilanChoice.map((item) => (
                <option key={item.id_master_keterampilan} value={item.nama_keterampilan}>
                  {item.nama_keterampilan}
                </option>
              ))}
            </select>
            {selectedKeterampilan === "Lainnya" && (
              <div>
                <label className="text-xs">Masukkan Keterampilan</label>
                <input
                  type="text"
                  name="lainnya"
                  className="p-2 border rounded-md text-xs w-full"
                  value={lainnyaKeterampilan}
                  onChange={(e) => setLainnyaKeterampilan(e.target.value)}
                  required
                />
              </div>
            )}
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
