import axios from "axios";
import React, { useState, useEffect } from "react";

const InputDataPribadi = ({ data, onDataChange }) => {
    const [jamaahChoice, setJamaahChoice] = useState([]);
    const [otonomChoice, setOtonomChoice] = useState([]);
    
    useEffect(() => {
        // Fungsi untuk fetch data dari API
        const fetchChoices = async () => {
          try {
            const response = await axios.get("http://127.0.0.1:8000/api/data_choice_pribadi");
            setJamaahChoice(response.data.jamaah);
            setOtonomChoice(response.data.otonom);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchChoices();
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
              value={data.nomorAnggota || ""}
              onChange={(e) => onDataChange("nomorAnggota", e.target.value)}
            />
          </div>
  
          {/* Nama Lengkap */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Nama Lengkap</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md text-xs"
              value={data.namaLengkap || ""}
              onChange={(e) => onDataChange("namaLengkap", e.target.value)}
            />
          </div>
  
          {/* Tempat Lahir */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Tempat Lahir</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md text-xs"
              value={data.tempatLahir || ""}
              onChange={(e) => onDataChange("tempatLahir", e.target.value)}
            />
          </div>
  
          {/* Tanggal Lahir */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Tanggal Lahir</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md text-xs"
              value={data.tanggalLahir || ""}
              onChange={(e) => onDataChange("tanggalLahir", e.target.value)}
            />
          </div>
  
          {/* Status Merital */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Status Merital</label>
            <select
              className="w-full p-2 border rounded-md text-xs"
              value={data.statusMerital || ""}
              onChange={(e) => onDataChange("statusMerital", e.target.value)}
            >
              <option value="Belum Menikah">Belum Menikah</option>
              <option value="Menikah">Menikah</option>
            </select>
          </div>
  
          {/* Golongan Darah */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Golongan Darah</label>
            <select
              className="w-full p-2 border rounded-md text-xs"
              value={data.golonganDarah || ""}
              onChange={(e) => onDataChange("golonganDarah", e.target.value)}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>
  
          {/* Email */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md text-xs"
              value={data.email || ""}
              onChange={(e) => onDataChange("email", e.target.value)}
            />
          </div>
  
          {/* Nomor Telepon */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Nomor Telepon</label>
            <input
              type="tel"
              className="w-full p-2 border rounded-md text-xs"
              value={data.nomorTelepon || ""}
              onChange={(e) => onDataChange("nomorTelepon", e.target.value)}
            />
          </div>
  
          {/* Alamat */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Alamat</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md text-xs"
              value={data.alamat || ""}
              onChange={(e) => onDataChange("alamat", e.target.value)}
            />
          </div>
  
          {/* Otonom */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Otonom</label>
            <select
              className="w-full p-2 border rounded-md text-xs"
              value={data.otonom || ""}
              onChange={(e) => onDataChange("otonom", e.target.value)}
            >
              <option value="">Pilih Otonom </option> {/* Opsi default */}
                {otonomChoice.map((choice) => (
                <option key={choice.id_otonom} value={choice.id_otonom}>
                    {choice.nama_otonom}
                </option>
                ))}
            </select>
          </div>
  
          {/* Jamaah */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Jamaah</label>
            <select
              className="w-full p-2 border rounded-md text-xs"
              value={data.jamaah || ""}
              onChange={(e) => onDataChange("jamaah", e.target.value)}
            >
                <option value="">Pilih Jamaah</option> {/* Opsi default */}
                {jamaahChoice.map((choice) => (
                <option key={choice.id_master_jamaah} value={choice.id_master_jamaah}>
                    {choice.nama_jamaah}
                </option>
                ))}
            </select>
          </div>
  
          {/* Status Aktif */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Status Aktif</label>
            <select
              className="w-full p-2 border rounded-md text-xs"
              value={data.statusAktif || ""}
              onChange={(e) => onDataChange("statusAktif", e.target.value)}
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak">Tidak</option>
              <option value="Meninggal Dunia">Meninggal Dunia</option>
              <option value="Mutasi">Mutasi</option>
            </select>
          </div>
  
          {/* Keterangan */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Keterangan</label>
            <textarea
              className="w-full p-2 border rounded-md text-xs"
              value={data.keterangan || ""}
              onChange={(e) => onDataChange("keterangan", e.target.value)}
            />
          </div>
  
          {/* Masa Aktif Anggota */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Masa Aktif Anggota</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md text-xs"
              value={data.masaAktif || ""}
              onChange={(e) => onDataChange("masaAktif", e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default InputDataPribadi;
  