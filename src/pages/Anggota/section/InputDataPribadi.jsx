import axios from "axios";
import React, { useState, useEffect } from "react";
import api from "../../../utils/api";

const InputDataPribadi = ({ data, onDataChange, nomorAnggota, setNomorAnggota }) => {
    const [jamaahChoice, setJamaahChoice] = useState([]);
    const [otonomChoice, setOtonomChoice] = useState([]);

    useEffect(() => {
        // Fungsi untuk fetch data dari API
        const fetchChoices = async () => {
          try {
            const response = await api.get("/data_choice_pribadi");
            setJamaahChoice(response.data.jamaah);
            setOtonomChoice(response.data.otonom);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchChoices();
      }, []);
    
    return (
      <div className="w-full">
        <div className="w-full px-4 sm:px-2">
          {/* Nomor Anggota */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Nomor Anggota</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md text-xs"
              value={data.nomorAnggota || ""}
              onChange={(e) => {
                onDataChange("nomorAnggota", e.target.value);
                setNomorAnggota(e.target.value);
              }}
            />
          </div>

          {/* Nomor KTP */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Nomor KTP</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md text-xs"
              value={data.nomorKTP || ""}
              onChange={(e) => onDataChange("nomorKTP", e.target.value)}
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
              <option value="">-- Silahkan Pilih</option>
              <option value="Belum Menikah">Belum Menikah</option>
              <option value="Menikah">Menikah</option>
              <option value="Duda">Duda</option>
            </select>
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

          {/* Nomor WA */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Nomor WA</label>
            <input
              type="tel"
              className="w-full p-2 border rounded-md text-xs"
              value={data.nomorWA || ""}
              onChange={(e) => onDataChange("nomorWA", e.target.value)}
            />
          </div>
  
          {/* Alamat */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Alamat sesuai KTP</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md text-xs"
              value={data.alamat || ""}
              onChange={(e) => onDataChange("alamat", e.target.value)}
            />
          </div>

          {/* Alamat Tinggal */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Alamat Tinggal</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md text-xs"
              value={data.alamatTinggal || ""}
              onChange={(e) => onDataChange("alamatTinggal", e.target.value)}
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
              <option value="">-- Silahkan Pilih</option>
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
                <option value="">-- Silahkan Pilih</option>
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
              value={data.statusAktif}
              onChange={(e) => onDataChange("statusAktif", e.target.value)}
            >
              <option value="">-- Silahkan Pilih</option>
              <option value="1">Aktif</option>
              <option value="0">Tidak</option>
              <option value="2">Meninggal Dunia</option>
              <option value="3">Mutasi</option>
            </select>
          </div>

          {/* Tahun Masuk Anggota */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Tahun Masuk Anggota</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md text-xs"
              value={data.tahunMasuk || ""}
              onChange={(e) => onDataChange("tahunMasuk", e.target.value)}
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
          
          {/* Kajian Rutin */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Kajian Rutin</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md text-xs"
              value={data.kajianRutin || ""}
              onChange={(e) => onDataChange("kajianRutin", e.target.value)}
            />
          </div>
          
          {/* Tahun Haji */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Tahun Haji</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md text-xs"
              value={data.tahunHaji || ""}
              onChange={(e) => onDataChange("tahunHaji", e.target.value)}
            />
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
        </div>
      </div>
    );
  };
  
  export default InputDataPribadi;
