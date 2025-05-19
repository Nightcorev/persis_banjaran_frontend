import React, { useEffect, useState } from "react";
import api from "../../../utils/api";

const InputDataPendidikan = ({ data, onDataChange, nomorAnggota }) => {
  const [tingkatPendidikanChoice, setTingkatPendidikanChoice] = useState([]);
  const [errors, setErrors] = useState({});

  // Validate field based on database data type
  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "tingkat": // int4
        if (value && isNaN(Number(value))) {
          errorMessage = "Tingkat pendidikan harus berupa angka";
        }
        break;
      case "instansi": // varchar(30)
        if (value && value.length > 30) {
          errorMessage = "Nama instansi maksimal 30 karakter";
        }
        break;
      case "jurusan": // varchar(25)
        if (value && value.length > 25) {
          errorMessage = "Jurusan maksimal 25 karakter";
        }
        break;
      case "tahunMasuk": // int4
        if (value && isNaN(Number(value))) {
          errorMessage = "Tahun masuk harus berupa angka";
        }
        break;
      case "tahunKeluar": // int4
        if (value && isNaN(Number(value))) {
          errorMessage = "Tahun keluar harus berupa angka";
        }
        break;
      case "jenisPendidikan": // text
        // No length validation for text type
        break;
      default:
        break;
    }

    return errorMessage;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate input
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    onDataChange({ ...data, [name]: value });
  };

  useEffect(() => {
    api
      .get("/data_choice_pendidikan")
      .then((response) => {
        setTingkatPendidikanChoice(response.data.pendidikan || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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

        {/* Tingkat Pendidikan */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Tingkat</label>
          <div className="w-full">
            <select
              name="tingkat"
              className={`w-full p-2 border rounded-md text-xs ${
                errors.tingkat ? "border-red-500" : ""
              }`}
              value={data.tingkat || ""}
              onChange={handleInputChange}
            >
              <option value="">-- Silahkan Pilih</option>
              {tingkatPendidikanChoice.map((item) => (
                <option
                  key={item.id_tingkat_pendidikan}
                  value={item.id_tingkat_pendidikan}
                >
                  {item.pendidikan}
                </option>
              ))}
            </select>
            {errors.tingkat && (
              <p className="text-red-500 text-xs mt-1">{errors.tingkat}</p>
            )}
          </div>
        </div>

        {/* Nama Sekolah/Instansi */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Nama Sekolah</label>
          <div className="w-full">
            <input
              type="text"
              name="instansi"
              className={`w-full p-2 border rounded-md text-xs ${
                errors.instansi ? "border-red-500" : ""
              }`}
              value={data.instansi || ""}
              onChange={handleInputChange}
              maxLength={30}
            />
            {errors.instansi && (
              <p className="text-red-500 text-xs mt-1">{errors.instansi}</p>
            )}
          </div>
        </div>

        {/* Jurusan */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Jurusan</label>
          <div className="w-full">
            <input
              type="text"
              name="jurusan"
              className={`w-full p-2 border rounded-md text-xs ${
                errors.jurusan ? "border-red-500" : ""
              }`}
              value={data.jurusan || ""}
              onChange={handleInputChange}
              maxLength={25}
            />
            {errors.jurusan && (
              <p className="text-red-500 text-xs mt-1">{errors.jurusan}</p>
            )}
          </div>
        </div>

        {/* Tahun Masuk */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Tahun Masuk</label>
          <div className="w-full">
            <input
              type="number"
              name="tahunMasuk"
              className={`w-full p-2 border rounded-md text-xs ${
                errors.tahunMasuk ? "border-red-500" : ""
              }`}
              value={data.tahunMasuk || ""}
              onChange={handleInputChange}
            />
            {errors.tahunMasuk && (
              <p className="text-red-500 text-xs mt-1">{errors.tahunMasuk}</p>
            )}
          </div>
        </div>

        {/* Tahun Keluar */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Tahun Keluar</label>
          <div className="w-full">
            <input
              type="number"
              name="tahunKeluar"
              className={`w-full p-2 border rounded-md text-xs ${
                errors.tahunKeluar ? "border-red-500" : ""
              }`}
              value={data.tahunKeluar || ""}
              onChange={handleInputChange}
            />
            {errors.tahunKeluar && (
              <p className="text-red-500 text-xs mt-1">{errors.tahunKeluar}</p>
            )}
          </div>
        </div>

        {/* Jenis Pendidikan */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Jenis Pendidikan</label>
          <div className="w-full">
            <select
              name="jenisPendidikan"
              className={`w-full p-2 border rounded-md text-xs ${
                errors.jenisPendidikan ? "border-red-500" : ""
              }`}
              value={data.jenisPendidikan || ""}
              onChange={handleInputChange}
            >
              <option value="">-- Silahkan Pilih</option>
              <option value="Formal">Formal</option>
              <option value="Non Formal">Non Formal</option>
            </select>
            {errors.jenisPendidikan && (
              <p className="text-red-500 text-xs mt-1">
                {errors.jenisPendidikan}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputDataPendidikan;
