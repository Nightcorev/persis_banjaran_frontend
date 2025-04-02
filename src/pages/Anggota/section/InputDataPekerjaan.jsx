import React, { useEffect, useState } from "react";

const InputDataPekerjaan = ({ data, onDataChange, nomorAnggota }) => {
  const [pekerjaanChoice, setPekerjaanChoice] = useState([]);
  const [isLainnya, setIsLainnya] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/data_choice_pekerjaan")
      .then((response) => response.json())
      .then((data) => setPekerjaanChoice(data.pekerjaan || []))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onDataChange({ ...data, [name]: value });

    if (name === "pekerjaan") {
      setIsLainnya(value === "Lainnya");
      if (value !== "Lainnya") {
        onDataChange({ ...data, pekerjaan: value, pekerjaanLainnya: "" });
      }
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[60%] px-4 sm:px-2">
        {/* Nomor Anggota */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Nomor Anggota</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md text-xs"
            value={nomorAnggota}
            disabled
          />
        </div>

        {/* Pekerjaan */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Pekerjaan</label>
          <select
            name="pekerjaan"
            className="w-full p-2 border rounded-md text-xs"
            value={data.pekerjaan || ""}
            onChange={handleInputChange}
          >
            <option value="">-- Silahkan Pilih --</option>
            {pekerjaanChoice.map((item) => (
              <option key={item.id_master_pekerjaan} value={item.id_master_pekerjaan}>
                {item.nama_pekerjaan}
              </option>
            ))}
          </select>
        </div>

        {/* Inputan tambahan jika memilih "Lainnya" */}
        {isLainnya && (
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Pekerjaan Lainnya</label>
            <input
              type="text"
              name="pekerjaanLainnya"
              className="w-full p-2 border rounded-md text-xs"
              value={data.pekerjaanLainnya || ""}
              onChange={handleInputChange}
            />
          </div>
        )}

        {/* Nama Instansi */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Nama Instansi</label>
          <input
            type="text"
            name="namaInstansi"
            className="w-full p-2 border rounded-md text-xs"
            value={data.namaInstansi || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Deskripsi Pekerjaan */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Deskripsi Pekerjaan</label>
          <textarea
            name="deskripsiPekerjaan"
            className="w-full p-2 border rounded-md text-xs"
            value={data.deskripsiPekerjaan || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Pendapatan */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Pendapatan</label>
          <select
            name="pendapatan"
            className="w-full p-2 border rounded-md text-xs"
            value={data.pendapatan || ""}
            onChange={handleInputChange}
          >
            <option value="">-- Silahkan Pilih --</option>
            <option value="Kurang dari 1 juta rupiah">Kurang dari 1 juta rupiah</option>
            <option value="1 juta s.d kurang dari 2 juta rupiah">1 juta s.d kurang dari 2 juta rupiah</option>
            <option value="2 Juta s.d kurang dari 3 juta rupiah">2 Juta s.d kurang dari 3 juta rupiah</option>
            <option value="3 juta s.d kurang dari 4 juta rupiah">3 juta s.d kurang dari 4 juta rupiah</option>
            <option value="Lebih dari 4 juta rupiah">Lebih dari 4 juta rupiah</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default InputDataPekerjaan;
