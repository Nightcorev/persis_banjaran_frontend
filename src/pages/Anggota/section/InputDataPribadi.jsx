import React, { useState, useEffect } from "react";
import api from "../../../utils/api";

const InputDataPribadi = ({ data, onDataChange, nomorAnggota, setNomorAnggota }) => {
    const [jamaahChoice, setJamaahChoice] = useState([]);
    const [otonomChoice, setOtonomChoice] = useState([]);
    const [errors, setErrors] = useState({});

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
    
    // Fungsi validasi berdasarkan tipe data dari database
    const validateField = (name, value) => {
      let errorMessage = "";
      
      // Check required fields
      const requiredFields = ["nomorAnggota", "nomorKTP", "namaLengkap", "otonom", "jamaah", "statusAktif"];
      if (requiredFields.includes(name) && !value) {
        return "Field ini wajib diisi";
      }

      switch(name) {
        case "nomorAnggota":  // serial4
          if (value && isNaN(Number(value))) {
            errorMessage = "Nomor anggota harus berupa angka";
          }
          break;
        case "nomorKTP":  // varchar(20)
          if (value && value.length > 20) {
            errorMessage = "NIK maksimal 20 karakter";
          }
          break;
        case "namaLengkap":  // varchar(100)
          if (value && value.length > 100) {
            errorMessage = "Nama lengkap maksimal 100 karakter";
          }
          break;
        case "tempatLahir":  // varchar(50)
          if (value && value.length > 50) {
            errorMessage = "Tempat lahir maksimal 50 karakter";
          }
          break;
        case "tanggalLahir":  // date
          if (value && isNaN(Date.parse(value))) {
            errorMessage = "Format tanggal tidak valid";
          }
          break;
        case "statusMerital":  // varchar(20)
          if (value && value.length > 20) {
            errorMessage = "Status merital maksimal 20 karakter";
          }
          break;
        case "nomorTelepon":  // varchar(15)
          if (value && value.length > 15) {
            errorMessage = "Nomor telepon maksimal 15 karakter";
          }
          break;
        case "nomorWA":  // varchar(15)
          if (value && value.length > 15) {
            errorMessage = "Nomor WA maksimal 15 karakter";
          }
          break;
        case "alamat":  // text
          // No length validation for text type
          break;
        case "alamatTinggal":  // text
          // No length validation for text type
          break;
        case "jamaah":  // int4
          if (value && isNaN(Number(value))) {
            errorMessage = "Jamaah harus berupa angka";
          }
          break;
        case "otonom":  // int4
          if (value && isNaN(Number(value))) {
            errorMessage = "Otonom harus berupa angka";
          }
          break;
        case "statusAktif":  // int4
          if (value && isNaN(Number(value))) {
            errorMessage = "Status aktif harus berupa angka";
          }
          break;
        case "tahunMasuk":  // int4
          if (value && isNaN(Number(value))) {
            errorMessage = "Tahun masuk harus berupa angka";
          }
          break;
        case "masaAktif":  // date
          if (value && isNaN(Date.parse(value))) {
            errorMessage = "Format tanggal tidak valid";
          }
          break;
        case "kajianRutin":  // varchar(100)
          if (value && value.length > 100) {
            errorMessage = "Kajian rutin maksimal 100 karakter";
          }
          break;
        case "tahunHaji":  // int4
          if (value && isNaN(Number(value))) {
            errorMessage = "Tahun haji harus berupa angka";
          }
          break;
        case "keterangan":  // text
          // No length validation for text type
          break;
        default:
          break;
      }
      
      return errorMessage;
    };

    // Update fungsi untuk menangani perubahan data dengan validasi
    const handleDataChange = (name, value) => {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
      
      onDataChange(name, value);
    };

    // Fungsi untuk validasi semua field yang wajib diisi
    const validateRequiredFields = () => {
      const requiredFields = ["nomorAnggota", "nomorKTP", "namaLengkap", "otonom", "jamaah", "statusAktif"];
      let newErrors = {...errors};
      let isValid = true;

      requiredFields.forEach(field => {
        if (!data[field]) {
          newErrors[field] = "Field ini wajib diisi";
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    };

    // Memvalidasi field ketika component di-mount
    useEffect(() => {
      const requiredFields = ["nomorAnggota", "nomorKTP", "namaLengkap", "otonom", "jamaah", "statusAktif"];
      let newErrors = {};

      requiredFields.forEach(field => {
        if (!data[field]) {
          newErrors[field] = "";  // Tidak menampilkan error saat awal, hanya saat submit atau blur
        }
      });

      setErrors(prev => ({...prev, ...newErrors}));
    }, []);
    
    return (
      <div className="w-full">
        <div className="w-full px-4 sm:px-2">
          {/* Nomor Anggota */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">
              Nomor Anggota <span className="text-red-500">*</span>
            </label>
            <div className="w-full">
              <input
                type="text"
                className={`w-full p-2 border rounded-md text-xs ${errors.nomorAnggota ? "border-red-500" : ""}`}
                value={data.nomorAnggota || ""}
                onChange={(e) => {
                  handleDataChange("nomorAnggota", e.target.value);
                  setNomorAnggota(e.target.value);
                }}
                onBlur={() => {
                  if (!data.nomorAnggota) {
                    setErrors(prev => ({
                      ...prev,
                      nomorAnggota: "Field ini wajib diisi"
                    }));
                  }
                }}
                required
              />
              {errors.nomorAnggota && <p className="text-red-500 text-xs mt-1">{errors.nomorAnggota}</p>}
            </div>
          </div>

          {/* Nomor KTP */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">
              Nomor KTP <span className="text-red-500">*</span>
            </label>
            <div className="w-full">
              <input
                type="text"
                className={`w-full p-2 border rounded-md text-xs ${errors.nomorKTP ? "border-red-500" : ""}`}
                value={data.nomorKTP || ""}
                onChange={(e) => handleDataChange("nomorKTP", e.target.value)}
                onBlur={() => {
                  if (!data.nomorKTP) {
                    setErrors(prev => ({
                      ...prev,
                      nomorKTP: "Field ini wajib diisi"
                    }));
                  }
                }}
                maxLength={20}
                required
              />
              {errors.nomorKTP && <p className="text-red-500 text-xs mt-1">{errors.nomorKTP}</p>}
            </div>
          </div>
  
          {/* Nama Lengkap */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <div className="w-full">
              <input
                type="text"
                className={`w-full p-2 border rounded-md text-xs ${errors.namaLengkap ? "border-red-500" : ""}`}
                value={data.namaLengkap || ""}
                onChange={(e) => handleDataChange("namaLengkap", e.target.value)}
                onBlur={() => {
                  if (!data.namaLengkap) {
                    setErrors(prev => ({
                      ...prev,
                      namaLengkap: "Field ini wajib diisi"
                    }));
                  }
                }}
                maxLength={100}
                required
              />
              {errors.namaLengkap && <p className="text-red-500 text-xs mt-1">{errors.namaLengkap}</p>}
            </div>
          </div>
  
          {/* Tempat Lahir */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Tempat Lahir</label>
            <div className="w-full">
              <input
                type="text"
                className={`w-full p-2 border rounded-md text-xs ${errors.tempatLahir ? "border-red-500" : ""}`}
                value={data.tempatLahir || ""}
                onChange={(e) => handleDataChange("tempatLahir", e.target.value)}
                maxLength={50}
              />
              {errors.tempatLahir && <p className="text-red-500 text-xs mt-1">{errors.tempatLahir}</p>}
            </div>
          </div>
  
          {/* Tanggal Lahir */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Tanggal Lahir</label>
            <div className="w-full">
              <input
                type="date"
                className={`w-full p-2 border rounded-md text-xs ${errors.tanggalLahir ? "border-red-500" : ""}`}
                value={data.tanggalLahir || ""}
                onChange={(e) => handleDataChange("tanggalLahir", e.target.value)}
              />
              {errors.tanggalLahir && <p className="text-red-500 text-xs mt-1">{errors.tanggalLahir}</p>}
            </div>
          </div>
  
          {/* Status Merital */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Status Merital</label>
            <div className="w-full">
              <select
                className={`w-full p-2 border rounded-md text-xs ${errors.statusMerital ? "border-red-500" : ""}`}
                value={data.statusMerital || ""}
                onChange={(e) => handleDataChange("statusMerital", e.target.value)}
              >
                <option value="">-- Silahkan Pilih</option>
                <option value="Belum Menikah">Belum Menikah</option>
                <option value="Menikah">Menikah</option>
                <option value="Duda">Duda</option>
              </select>
              {errors.statusMerital && <p className="text-red-500 text-xs mt-1">{errors.statusMerital}</p>}
            </div>
          </div>
  
          {/* Nomor Telepon */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Nomor Telepon</label>
            <div className="w-full">
              <input
                type="tel"
                className={`w-full p-2 border rounded-md text-xs ${errors.nomorTelepon ? "border-red-500" : ""}`}
                value={data.nomorTelepon || ""}
                onChange={(e) => handleDataChange("nomorTelepon", e.target.value)}
                maxLength={15}
              />
              {errors.nomorTelepon && <p className="text-red-500 text-xs mt-1">{errors.nomorTelepon}</p>}
            </div>
          </div>

          {/* Nomor WA */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Nomor WA</label>
            <div className="w-full">
              <input
                type="tel"
                className={`w-full p-2 border rounded-md text-xs ${errors.nomorWA ? "border-red-500" : ""}`}
                value={data.nomorWA || ""}
                onChange={(e) => handleDataChange("nomorWA", e.target.value)}
                maxLength={15}
              />
              {errors.nomorWA && <p className="text-red-500 text-xs mt-1">{errors.nomorWA}</p>}
            </div>
          </div>
  
          {/* Alamat */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Alamat sesuai KTP</label>
            <div className="w-full">
              <input
                type="text"
                className={`w-full p-2 border rounded-md text-xs ${errors.alamat ? "border-red-500" : ""}`}
                value={data.alamat || ""}
                onChange={(e) => handleDataChange("alamat", e.target.value)}
              />
              {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
            </div>
          </div>

          {/* Alamat Tinggal */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Alamat Tinggal</label>
            <div className="w-full">
              <input
                type="text"
                className={`w-full p-2 border rounded-md text-xs ${errors.alamatTinggal ? "border-red-500" : ""}`}
                value={data.alamatTinggal || ""}
                onChange={(e) => handleDataChange("alamatTinggal", e.target.value)}
              />
              {errors.alamatTinggal && <p className="text-red-500 text-xs mt-1">{errors.alamatTinggal}</p>}
            </div>
          </div>
  
          {/* Otonom */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">
              Otonom <span className="text-red-500">*</span>
            </label>
            <div className="w-full">
              <select
                className={`w-full p-2 border rounded-md text-xs ${errors.otonom ? "border-red-500" : ""}`}
                value={data.otonom || ""}
                onChange={(e) => handleDataChange("otonom", e.target.value)}
                onBlur={() => {
                  if (!data.otonom) {
                    setErrors(prev => ({
                      ...prev,
                      otonom: "Field ini wajib diisi"
                    }));
                  }
                }}
                required
              >
                <option value="">-- Silahkan Pilih</option>
                {otonomChoice.map((choice) => (
                  <option key={choice.id_otonom} value={choice.id_otonom}>
                    {choice.nama_otonom}
                  </option>
                ))}
              </select>
              {errors.otonom && <p className="text-red-500 text-xs mt-1">{errors.otonom}</p>}
            </div>
          </div>
  
          {/* Jamaah */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">
              Jamaah <span className="text-red-500">*</span>
            </label>
            <div className="w-full">
              <select
                className={`w-full p-2 border rounded-md text-xs ${errors.jamaah ? "border-red-500" : ""}`}
                value={data.jamaah || ""}
                onChange={(e) => handleDataChange("jamaah", e.target.value)}
                onBlur={() => {
                  if (!data.jamaah) {
                    setErrors(prev => ({
                      ...prev,
                      jamaah: "Field ini wajib diisi"
                    }));
                  }
                }}
                required
              >
                <option value="">-- Silahkan Pilih</option>
                {jamaahChoice.map((choice) => (
                  <option key={choice.id_master_jamaah} value={choice.id_master_jamaah}>
                    {choice.nama_jamaah}
                  </option>
                ))}
              </select>
              {errors.jamaah && <p className="text-red-500 text-xs mt-1">{errors.jamaah}</p>}
            </div>
          </div>
  
          {/* Status Aktif */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">
              Status Aktif <span className="text-red-500">*</span>
            </label>
            <div className="w-full">
              <select
                className={`w-full p-2 border rounded-md text-xs ${errors.statusAktif ? "border-red-500" : ""}`}
                value={data.statusAktif || ""}
                onChange={(e) => handleDataChange("statusAktif", e.target.value)}
                onBlur={() => {
                  if (!data.statusAktif) {
                    setErrors(prev => ({
                      ...prev,
                      statusAktif: "Field ini wajib diisi"
                    }));
                  }
                }}
                required
              >
                <option value="">-- Silahkan Pilih</option>
                <option value="1">Aktif</option>
                <option value="0">Tidak</option>
                <option value="2">Meninggal Dunia</option>
                <option value="3">Mutasi</option>
              </select>
              {errors.statusAktif && <p className="text-red-500 text-xs mt-1">{errors.statusAktif}</p>}
            </div>
          </div>

          {/* Tahun Masuk Anggota */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Tahun Masuk Anggota</label>
            <div className="w-full">
              <input
                type="number"
                className={`w-full p-2 border rounded-md text-xs ${errors.tahunMasuk ? "border-red-500" : ""}`}
                value={data.tahunMasuk || ""}
                onChange={(e) => handleDataChange("tahunMasuk", e.target.value)}
              />
              {errors.tahunMasuk && <p className="text-red-500 text-xs mt-1">{errors.tahunMasuk}</p>}
            </div>
          </div>
  
          {/* Masa Aktif Anggota */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Masa Aktif Anggota</label>
            <div className="w-full">
              <input
                type="date"
                className={`w-full p-2 border rounded-md text-xs ${errors.masaAktif ? "border-red-500" : ""}`}
                value={data.masaAktif || ""}
                onChange={(e) => handleDataChange("masaAktif", e.target.value)}
              />
              {errors.masaAktif && <p className="text-red-500 text-xs mt-1">{errors.masaAktif}</p>}
            </div>
          </div>
          
          {/* Kajian Rutin */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Kajian Rutin</label>
            <div className="w-full">
              <input
                type="text"
                className={`w-full p-2 border rounded-md text-xs ${errors.kajianRutin ? "border-red-500" : ""}`}
                value={data.kajianRutin || ""}
                onChange={(e) => handleDataChange("kajianRutin", e.target.value)}
                maxLength={100}
              />
              {errors.kajianRutin && <p className="text-red-500 text-xs mt-1">{errors.kajianRutin}</p>}
            </div>
          </div>
          
          {/* Tahun Haji */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Tahun Haji</label>
            <div className="w-full">
              <input
                type="number"
                className={`w-full p-2 border rounded-md text-xs ${errors.tahunHaji ? "border-red-500" : ""}`}
                value={data.tahunHaji || ""}
                onChange={(e) => handleDataChange("tahunHaji", e.target.value)}
              />
              {errors.tahunHaji && <p className="text-red-500 text-xs mt-1">{errors.tahunHaji}</p>}
            </div>
          </div>

          {/* Keterangan */}
          <div className="flex items-center gap-4 pb-4">
            <label className="text-xs w-1/3">Keterangan</label>
            <div className="w-full">
              <textarea
                className={`w-full p-2 border rounded-md text-xs ${errors.keterangan ? "border-red-500" : ""}`}
                value={data.keterangan || ""}
                onChange={(e) => handleDataChange("keterangan", e.target.value)}
              />
              {errors.keterangan && <p className="text-red-500 text-xs mt-1">{errors.keterangan}</p>}
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            <span className="text-red-500">*</span> Field wajib diisi
          </div>
        </div>
      </div>
    );
  };
  
  export default InputDataPribadi;
