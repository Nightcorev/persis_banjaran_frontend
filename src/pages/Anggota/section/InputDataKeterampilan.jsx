import React, { useEffect, useState } from "react";
import api from "../../../utils/api";

const InputDataKeterampilan = ({ data, onDataChange, nomorAnggota }) => {
  const [keterampilanChoice, setKeterampilanChoice] = useState([]);
  const [isLainnya, setIsLainnya] = useState(false);

  useEffect(() => {
    api.get("/data_choice_keterampilan")
      .then((response) => setKeterampilanChoice(response.data.keterampilan || []))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onDataChange({ ...data, [name]: value });

    if (name === "keterampilan") {
      setIsLainnya(value === "Lainnya");
      if (value !== "Lainnya") {
        onDataChange({ ...data, keterampilan: value, keterampilanLainnya: "" });
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

        {/* Keterampilan */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Keterampilan</label>
          <select
            name="keterampilan"
            className="w-full p-2 border rounded-md text-xs"
            value={data.keterampilan || ""}
            onChange={handleInputChange}
          >
            <option value="">-- Silahkan Pilih --</option>
            {keterampilanChoice.map((item) => (
              <option key={item.id_master_keterampilan} value={item.id_master_keterampilan}>
                {item.nama_keterampilan}
              </option>
            ))}
          </select>
        </div>

        {/* Inputan tambahan jika memilih "Lainnya" */}
        {isLainnya && (
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Keterampilan Lainnya</label>
            <input
              type="text"
              name="keterampilanLainnya"
              className="w-full p-2 border rounded-md text-xs"
              value={data.keterampilanLainnya || ""}
              onChange={handleInputChange}
            />
          </div>
        )}

        {/* Deskripsi Keterampilan */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Deskripsi Keterampilan</label>
          <textarea
            name="deskripsiKeterampilan"
            className="w-full p-2 border rounded-md text-xs"
            value={data.deskripsiKeterampilan || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default InputDataKeterampilan;
