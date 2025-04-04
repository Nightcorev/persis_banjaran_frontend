import React, { useEffect, useState } from "react";
import api from "../../../utils/api";

const InputDataPendidikan = ({ data, onDataChange, nomorAnggota }) => {
  const [tingkatPendidikanChoice, setTingkatPendidikanChoice] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onDataChange({ ...data, [name]: value });
  };

  useEffect(() => {
    api.get("/data_choice_pendidikan")
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
          <select
            name="tingkat"
            className="w-full p-2 border rounded-md text-xs"
            value={data.tingkat || ""}
            onChange={handleInputChange}
          >
            <option value="">-- Silahkan Pilih</option>
            {tingkatPendidikanChoice.map((item) => (
              <option key={item.id_tingkat_pendidikan} value={item.id_tingkat_pendidikan}>
                {item.pendidikan}
              </option>
            ))}
          </select>
        </div>

        {/* Nama Sekolah */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Nama Sekolah</label>
          <input
            type="text"
            name="namaSekolah"
            className="w-full p-2 border rounded-md text-xs"
            value={data.namaSekolah || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Jurusan */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Jurusan</label>
          <input
            type="text"
            name="jurusan"
            className="w-full p-2 border rounded-md text-xs"
            value={data.jurusan || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Tahun Masuk */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Tahun Masuk</label>
          <input
            type="number"
            name="tahunMasuk"
            className="w-full p-2 border rounded-md text-xs"
            value={data.tahunMasuk || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Tahun Keluar */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Tahun Keluar</label>
          <input
            type="number"
            name="tahunKeluar"
            className="w-full p-2 border rounded-md text-xs"
            value={data.tahunKeluar || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Jenis Pendidikan */}
        <div className="flex items-center gap-4 pb-4">
          <label className="text-xs w-1/3">Jenis Pendidikan</label>
          <select
            name="jenisPendidikan"
            className="w-full p-2 border rounded-md text-xs"
            value={data.jenisPendidikan || ""}
            onChange={handleInputChange}
          >
            <option value="">-- Silahkan Pilih</option>
            <option value="Formal">Formal</option>
            <option value="Non Formal">Non Formal</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default InputDataPendidikan;
