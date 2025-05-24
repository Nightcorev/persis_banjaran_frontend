import React, { useEffect, useState } from "react";
import api from "../../../utils/api";

const InputDataPekerjaan = ({ data, onDataChange, nomorAnggota }) => {
  const [pekerjaanChoice, setPekerjaanChoice] = useState([]);
  const [isLainnya, setIsLainnya] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate field based on database data type
  const validateField = (name, value) => {
    let errorMessage = "";
    
    switch(name) {
      case "pekerjaan": // int4 (id_master_pekerjaan)
        if (value && isNaN(Number(value))) {
          errorMessage = "Pekerjaan harus berupa angka";
        }
        break;
      case "pekerjaanLainnya": // varchar(100) (lainnya)
        if (value && value.length > 100) {
          errorMessage = "Pekerjaan lainnya maksimal 100 karakter";
        }
        break;
      case "namaInstansi": // varchar(50) (nama_instasi)
        if (value && value.length > 50) {
          errorMessage = "Nama instansi maksimal 50 karakter";
        }
        break;
      case "deskripsiPekerjaan": // text (deskripsi_pekerjaan)
        // No length validation for text type
        break;
      case "pendapatan": // varchar(50)
        if (value && value.length > 50) {
          errorMessage = "Pendapatan maksimal 50 karakter";
        }
        break;
      default:
        break;
    }
    
    return errorMessage;
  };

  useEffect(() => {
    api.get("/data_choice_pekerjaan")
      .then((response) => {
        setPekerjaanChoice(response.data.pekerjaan || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate input
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    onDataChange({ ...data, [name]: value });

    if (name === "pekerjaan") {
      const isLain = pekerjaanChoice.find(item => 
        item.id_master_pekerjaan == value && 
        item.nama_pekerjaan.toLowerCase().includes("lain")
      );
      setIsLainnya(!!isLain);
      
      if (!isLain && data.pekerjaanLainnya) {
        onDataChange({ ...data, [name]: value, pekerjaanLainnya: "" });
      } else {
        onDataChange({ ...data, [name]: value });
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
          <div className="w-full">
            <select
              name="pekerjaan"
              className={`w-full p-2 border rounded-md text-xs ${errors.pekerjaan ? "border-red-500" : ""}`}
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
            {errors.pekerjaan && <p className="text-red-500 text-xs mt-1">{errors.pekerjaan}</p>}
          </div>
        </div>

        {/* Inputan tambahan jika memilih "Lainnya" */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Pekerjaan Lainnya</label>
          <div className="w-full">
            <input
              type="text"
              name="pekerjaanLainnya"
              className={`w-full p-2 border rounded-md text-xs ${errors.pekerjaanLainnya ? "border-red-500" : ""}`}
              value={data.pekerjaanLainnya || ""}
              onChange={handleInputChange}
              maxLength={100}
              disabled={!isLainnya}
            />
            {errors.pekerjaanLainnya && <p className="text-red-500 text-xs mt-1">{errors.pekerjaanLainnya}</p>}
          </div>
        </div>

        {/* Nama Instansi */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Nama Instansi</label>
          <div className="w-full">
            <input
              type="text"
              name="namaInstansi"
              className={`w-full p-2 border rounded-md text-xs ${errors.namaInstansi ? "border-red-500" : ""}`}
              value={data.namaInstansi || ""}
              onChange={handleInputChange}
              maxLength={50}
            />
            {errors.namaInstansi && <p className="text-red-500 text-xs mt-1">{errors.namaInstansi}</p>}
          </div>
        </div>

        {/* Deskripsi Pekerjaan */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Deskripsi Pekerjaan</label>
          <div className="w-full">
            <textarea
              name="deskripsiPekerjaan"
              className={`w-full p-2 border rounded-md text-xs ${errors.deskripsiPekerjaan ? "border-red-500" : ""}`}
              value={data.deskripsiPekerjaan || ""}
              onChange={handleInputChange}
            />
            {errors.deskripsiPekerjaan && <p className="text-red-500 text-xs mt-1">{errors.deskripsiPekerjaan}</p>}
          </div>
        </div>

        {/* Pendapatan */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Pendapatan</label>
          <div className="w-full">
            <select
              name="pendapatan"
              className={`w-full p-2 border rounded-md text-xs ${errors.pendapatan ? "border-red-500" : ""}`}
              value={data.pendapatan || ""}
              onChange={handleInputChange}
            >
              <option value="">-- Silahkan Pilih --</option>
              <option value="1">Kurang dari 1 juta rupiah</option>
              <option value="2">1 juta s.d kurang dari 2 juta rupiah</option>
              <option value="3">2 Juta s.d kurang dari 3 juta rupiah</option>
              <option value="4">3 juta s.d kurang dari 4 juta rupiah</option>
              <option value="5">Lebih dari 4 juta rupiah</option>
            </select>
            {errors.pendapatan && <p className="text-red-500 text-xs mt-1">{errors.pendapatan}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputDataPekerjaan;
