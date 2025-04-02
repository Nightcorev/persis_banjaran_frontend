import React, { useState } from "react";

const InputDataKeluarga = ({ data, onDataChange, nomorAnggota }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onDataChange({ ...data, [name]: value });
    };
    
  return (
    <div className="flex justify-center">
        <div className="w-full max-w-[60%] px-4 sm:px-2">
            <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Nomor Anggota</label>
            <input
            type="text"
            className="w-full p-2 border rounded-md text-xs"
            value={nomorAnggota}
            disabled
            />
        </div>

        <div className="flex items-center gap-4 pb-4">
                <label className="text-xs w-1/3">Jumlah Tanggungan</label>
                <select
                name="jumlahTanggungan"
                className="w-full p-2 border rounded-md text-xs"
                value={data.jumlahTanggungan}
                onChange={handleInputChange}
                >
                <option value="">-- Silahkan Pilih</option>
                <option value="Kurang dari 2 orang">Kurang dari 2 orang</option>
                <option value="2-3 Orang">2-3 Orang</option>
                <option value="4-5 orang">4-5 orang</option>
                <option value="Lebih dari 5 Orang">Lebih dari 5 Orang</option>
                </select>
            </div>

        <div className="flex items-center gap-4 pb-4 pb-4">
            <label className="text-xs w-1/3">Nama Istri</label>
            <input
            type="text"
            name="namaIstri"
            className="w-full p-2 border rounded-md text-xs"
            value={data.namaIstri || ""}
            onChange={handleInputChange}
            />
        </div>

        <div className="flex items-center gap-4 pb-4">
                <label className="text-xs w-1/3">Istri Anggota Persistri</label>
                <select
                name="anggotaPersistri"
                className="w-full p-2 border rounded-md text-xs"
                value={data.anggotaPersistri}
                onChange={handleInputChange}
                >
                <option value="">-- Silahkan Pilih</option>
                <option value="1">Ya</option>
                <option value="0">Tidak</option>
                </select>
            </div>

        <div className="flex items-center gap-4 pb-4">
                <label className="text-xs w-1/3">Status Kepemilikan Rumah</label>
                <select
                name="statusKepemilikanRumah"
                className="w-full p-2 border rounded-md text-xs"
                value={data.statusKepemilikanRumah}
                onChange={handleInputChange}
                >
                <option value="">-- Silahkan Pilih</option>
                <option value="Pribadi">Pribadi</option>
                <option value="Sewa">Sewa</option>
                </select>
            </div>

            <div className="flex items-center gap-4 pb-4">
                <label className="text-xs w-1/3">Jumlah Anak</label>
                <input
                type="number"
                name="jumlaSeluruhAnak"
                className="w-full p-2 border rounded-md text-xs"
                value={data.jumlaSeluruhAnak || ""}
                onChange={handleInputChange}
                />
            </div>

            <div className="flex items-center gap-4 pb-4">
                <label className="text-xs w-1/3">Jumlah Anak yang Menjadi Pemuda</label>
                <input
                type="number"
                name="jumlaAnakPemuda"
                className="w-full p-2 border rounded-md text-xs"
                value={data.jumlaAnakPemuda || ""}
                onChange={handleInputChange}
                />
            </div>

            <div className="flex items-center gap-4 pb-4">
                <label className="text-xs w-1/3">Jumlah Anak yang Menjadi Pemudi</label>
                <input
                type="number"
                name="jumlaAnakPemudi"
                className="w-full p-2 border rounded-md text-xs"
                value={data.jumlaAnakPemudi || ""}
                onChange={handleInputChange}
                />
            </div>
        </div>
    </div>
  );
};

export default InputDataKeluarga;
