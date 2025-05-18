import React, { useState } from "react";

const InputDataKeluarga = ({ data, onDataChange, nomorAnggota }) => {
    const [errors, setErrors] = useState({});

    // Validate field based on database data type
    const validateField = (name, value) => {
        let errorMessage = "";
        
        switch(name) {
            case "jumlahTanggungan": // varchar(30)
                if (value && value.length > 30) {
                    errorMessage = "Jumlah tanggungan maksimal 30 karakter";
                }
                break;
            case "namaIstri": // varchar(100)
                if (value && value.length > 100) {
                    errorMessage = "Nama istri maksimal 100 karakter";
                }
                break;
            case "anggotaPersistri": // int4
                if (value && isNaN(Number(value))) {
                    errorMessage = "Anggota persistri harus berupa angka";
                }
                break;
            case "jumlaSeluruhAnak": // int4
                if (value && isNaN(Number(value))) {
                    errorMessage = "Jumlah anak harus berupa angka";
                }
                break;
            case "jumlaAnakPemuda": // int4
                if (value && isNaN(Number(value))) {
                    errorMessage = "Jumlah anak pemuda harus berupa angka";
                }
                break;
            case "jumlaAnakPemudi": // int4
                if (value && isNaN(Number(value))) {
                    errorMessage = "Jumlah anak pemudi harus berupa angka";
                }
                break;
            case "statusKepemilikanRumah": // varchar(10)
                if (value && value.length > 10) {
                    errorMessage = "Status kepemilikan rumah maksimal 10 karakter";
                }
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
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
        
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
                    <div className="w-full">
                        <select
                            name="jumlahTanggungan"
                            className={`w-full p-2 border rounded-md text-xs ${errors.jumlahTanggungan ? "border-red-500" : ""}`}
                            value={data.jumlahTanggungan || ""}
                            onChange={handleInputChange}
                        >
                            <option value="">-- Silahkan Pilih</option>
                            <option value="Kurang dari 2 orang">Kurang dari 2 orang</option>
                            <option value="2-3 Orang">2-3 Orang</option>
                            <option value="4-5 orang">4-5 orang</option>
                            <option value="Lebih dari 5 Orang">Lebih dari 5 Orang</option>
                        </select>
                        {errors.jumlahTanggungan && <p className="text-red-500 text-xs mt-1">{errors.jumlahTanggungan}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-4 pb-4">
                    <label className="text-xs w-1/3">Nama Istri</label>
                    <div className="w-full">
                        <input
                            type="text"
                            name="namaIstri"
                            className={`w-full p-2 border rounded-md text-xs ${errors.namaIstri ? "border-red-500" : ""}`}
                            value={data.namaIstri || ""}
                            onChange={handleInputChange}
                            maxLength={100}
                        />
                        {errors.namaIstri && <p className="text-red-500 text-xs mt-1">{errors.namaIstri}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-4 pb-4">
                    <label className="text-xs w-1/3">Istri Anggota Persistri</label>
                    <div className="w-full">
                        <select
                            name="anggotaPersistri"
                            className={`w-full p-2 border rounded-md text-xs ${errors.anggotaPersistri ? "border-red-500" : ""}`}
                            value={data.anggotaPersistri ?? ""}
                            onChange={handleInputChange}
                        >
                            <option value="">-- Silahkan Pilih</option>
                            <option value="1">Ya</option>
                            <option value="0">Tidak</option>
                        </select>
                        {errors.anggotaPersistri && <p className="text-red-500 text-xs mt-1">{errors.anggotaPersistri}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-4 pb-4">
                    <label className="text-xs w-1/3">Status Kepemilikan Rumah</label>
                    <div className="w-full">
                        <select
                            name="statusKepemilikanRumah"
                            className={`w-full p-2 border rounded-md text-xs ${errors.statusKepemilikanRumah ? "border-red-500" : ""}`}
                            value={data.statusKepemilikanRumah || ""}
                            onChange={handleInputChange}
                        >
                            <option value="">-- Silahkan Pilih</option>
                            <option value="Pribadi">Pribadi</option>
                            <option value="Sewa">Sewa</option>
                        </select>
                        {errors.statusKepemilikanRumah && <p className="text-red-500 text-xs mt-1">{errors.statusKepemilikanRumah}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-4 pb-4">
                    <label className="text-xs w-1/3">Jumlah Anak</label>
                    <div className="w-full">
                        <input
                            type="number"
                            name="jumlaSeluruhAnak"
                            className={`w-full p-2 border rounded-md text-xs ${errors.jumlaSeluruhAnak ? "border-red-500" : ""}`}
                            value={data.jumlaSeluruhAnak ?? 0}
                            onChange={handleInputChange}
                            min="0"
                        />
                        {errors.jumlaSeluruhAnak && <p className="text-red-500 text-xs mt-1">{errors.jumlaSeluruhAnak}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-4 pb-4">
                    <label className="text-xs w-1/3">Jumlah Anak yang Menjadi Pemuda</label>
                    <div className="w-full">
                        <input
                            type="number"
                            name="jumlaAnakPemuda"
                            className={`w-full p-2 border rounded-md text-xs ${errors.jumlaAnakPemuda ? "border-red-500" : ""}`}
                            value={data.jumlaAnakPemuda ?? 0}
                            onChange={handleInputChange}
                            min="0"
                        />
                        {errors.jumlaAnakPemuda && <p className="text-red-500 text-xs mt-1">{errors.jumlaAnakPemuda}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-4 pb-4">
                    <label className="text-xs w-1/3">Jumlah Anak yang Menjadi Pemudi</label>
                    <div className="w-full">
                        <input
                            type="number"
                            name="jumlaAnakPemudi"
                            className={`w-full p-2 border rounded-md text-xs ${errors.jumlaAnakPemudi ? "border-red-500" : ""}`}
                            value={data.jumlaAnakPemudi ?? 0}
                            onChange={handleInputChange}
                            min="0"
                        />
                        {errors.jumlaAnakPemudi && <p className="text-red-500 text-xs mt-1">{errors.jumlaAnakPemudi}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InputDataKeluarga;
