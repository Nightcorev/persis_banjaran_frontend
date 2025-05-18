import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // Tambahkan useLocation
import FieldAlert from "../../../components/FieldAlert";
import api from "../../../utils/api";

const AddMusyawarah = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Ambil location untuk mendapatkan state
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    id_master_jamaah: location.state?.id_master_jamaah || "", // Ambil dari location state
    tgl_pelaksanaan: "",
    tgl_akhir_jihad: "",
    aktif: true,
    tingkat_musyawarah: "jamaah", // Add default value
    no_sk: "", // Add new field
    id_anggota: "",
  });

  // Hapus state jamaahList dan useEffect untuk fetch data jamaah karena tidak diperlukan lagi
  const [anggotaList, setAnggotaList] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch anggota saat komponen mount
  useEffect(() => {
    const fetchAnggota = async () => {
      if (formData.id_master_jamaah) {
        setIsLoading(true);
        try {
          const response = await api.get(`/anggota/choice_by-jamaah/${formData.id_master_jamaah}`);
          if (response.data?.data) {
            setAnggotaList(response.data.data);
          } else {
            console.error("Data Anggota tidak valid:", response);
            setAnggotaList([]);
          }
        } catch (err) {
          console.error("Gagal ambil data anggota:", err);
          setAnggotaList([]);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    fetchAnggota();
  }, [formData.id_master_jamaah]);

  // Modify the useEffect for fetching musyawarah data in edit mode
  useEffect(() => {
    const fetchMusyawarah = async () => {
      if (isEditMode) {
        setIsLoading(true);
        try {
          const response = await api.get(`/detail_musyawarah/${id}`);
          if (response.data?.status === 200 && response.data?.data?.data?.[0]) {
            // Get the first item from data array
            const musyawarahData = response.data.data.data[0];
            const ketuaData = musyawarahData.musyawarah_detail?.find(
              detail => detail.jabatan === "Ketua"
            );
  
            // Update to include all fields
            setFormData({
              id_master_jamaah: musyawarahData.id_master_jamaah || "",
              tgl_pelaksanaan: musyawarahData.tgl_pelaksanaan || "",
              tgl_akhir_jihad: musyawarahData.tgl_akhir_jihad || "",
              aktif: musyawarahData.aktif ?? true,
              tingkat_musyawarah: musyawarahData.tingkat_musyawarah || "jamaah",
              no_sk: musyawarahData.no_sk || "",
              id_anggota: ketuaData?.id_anggota || "",
            });
  
            // Set ketua info for display
            if (ketuaData?.anggota) {
              setAnggotaList([ketuaData.anggota]);
            }
          } else {
            setMessage("Data tidak ditemukan");
            setIsModalOpen(true);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setMessage("Gagal mengambil data");
          setIsModalOpen(true);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    fetchMusyawarah();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!isEditMode && !formData.id_master_jamaah) {
      setMessage("Harap pilih Jamaah.");
      setIsModalOpen(true);
      return false;
    }
    if (!isEditMode && !formData.id_anggota) {
      setMessage("Harap pilih Ketua Jamaah.");
      setIsModalOpen(true);
      return false;
    }
    if (!formData.tgl_pelaksanaan) {
      setMessage("Harap isi kolom Tanggal Pelaksanaan.");
      setIsModalOpen(true);
      return false;
    }
    if (!formData.tgl_akhir_jihad) {
      setMessage("Harap isi kolom Tanggal Akhir Jihad.");
      setIsModalOpen(true);
      return false;
    }
    // No validation for optional fields tingkat_musyawarah and no_sk
    return true;
  };

  // Modifikasi handleSubmit untuk menggunakan api
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api[isEditMode ? 'put' : 'post'](
        isEditMode ? `/edit_musyawarah/${id}` : '/add_musyawarah',
        formData
      );
      
      if (response.data?.status === 200 || response.data?.status === 201) {
        setMessage(isEditMode ? "Data berhasil diperbarui!" : "Data berhasil disimpan!");
        navigate(-1);
      } else {
        throw new Error(response.data?.message || "Terjadi kesalahan");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan: " + (error.response?.data?.message || error.message));
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const renderKetuaJamaahField = () => {
    if (isEditMode) {
      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-green-800">
            Ketua Jamaah
          </label>
          <input
            type="text"
            value="" // Set empty value
            disabled
            className="border border-green-200 p-2 rounded-md w-full bg-gray-50"
            placeholder="Data ketua tidak ditampilkan dalam mode edit"
          />
          <p className="text-xs text-gray-500">
            Ketua jamaah tidak dapat diubah dalam mode edit
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-green-800">
          Ketua Jamaah <span className="text-red-500">*</span>
        </label>
        <select
          name="id_anggota"
          value={formData.id_anggota}
          onChange={handleChange}
          className="border border-green-200 p-2 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          disabled={!formData.id_master_jamaah || isLoading}
        >
          <option value="">
            {isLoading 
              ? "Memuat data anggota..." 
              : formData.id_master_jamaah 
                ? "Pilih Ketua Jamaah"
                : "Pilih Jamaah terlebih dahulu"
            }
          </option>
          {Array.isArray(anggotaList) &&
            anggotaList.map((anggota) => (
              <option key={anggota.id_anggota} value={anggota.id_anggota}>
                {anggota.nama_lengkap}
              </option>
            ))}
        </select>
        <p className="text-xs text-gray-500">
          {!formData.id_master_jamaah 
            ? "Pilih jamaah terlebih dahulu untuk melihat daftar anggota"
            : "Pilih anggota yang akan menjadi ketua"
  }</p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg">
      {/* Card Header */}
      <div className="border-b border-green-100 pb-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-green-800">
            {isEditMode ? "Edit Musyawarah" : "Tambah Musyawarah"}
          </h2>
          <div className="flex gap-3">
              <button  
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors shadow-sm flex items-center justify-center w-full md:w-auto">
                <span 
                className="mr-1">←</span> Kembali
              </button>
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors shadow-sm flex items-center justify-center w-full md:w-auto disabled:opacity-70"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex flex-col gap-6">
        {/* Hapus field Nama Jamaah */}

        {/* New Ketua Jamaah select */}
        {renderKetuaJamaahField()}
        
        {/* Tanggal (side by side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-800">Tanggal Pelaksanaan <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="tgl_pelaksanaan"
              value={formData.tgl_pelaksanaan}
              onChange={handleChange}
              className="border border-green-200 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
            <p className="text-xs text-gray-500">Masukkan tanggal saat musyawarah dilaksanakan</p>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-800">Tanggal Akhir Jihad <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="tgl_akhir_jihad"
              value={formData.tgl_akhir_jihad}
              onChange={handleChange}
              className="border border-green-200 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
            <p className="text-xs text-gray-500">Masukkan tanggal akhir jihad yang direncanakan</p>
          </div>
        </div>

        {/* New fields */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-800">Nomor SK</label>
            <input
              type="text"
              name="no_sk"
              value={formData.no_sk}
              onChange={handleChange}
              maxLength={100}
              className="border border-green-200 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="Masukkan nomor SK"
            />
            <p className="text-xs text-gray-500">Opsional, maksimal 100 karakter</p>
          </div>
        </div>

        {/* Modified Status Aktif */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-green-800">
            Status Aktif
          </label>
          <select
            name="aktif"
            value={formData.aktif}
            onChange={(e) => handleChange({
              target: {
                name: 'aktif',
                value: e.target.value === 'true'
              }
            })}
            className="border border-green-200 p-2 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          >
            <option value={true}>Aktif</option>
            <option value={false}>Tidak Aktif</option>
          </select>
          <p className="text-xs text-gray-500">
            Jika diset aktif, musyawarah lain akan dinonaktifkan secara otomatis
          </p>
        </div>
      </div>

      {/* Form Footer with helper text */}
      <div className="mt-8 pt-4 border-t border-green-100">
        <p className="text-sm text-gray-600">
          <span className="text-red-500">*</span> menandakan kolom yang wajib diisi
        </p>
      </div>

      {/* Alert Modal */}
      <FieldAlert isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message={message} />
    </div>
  );
};

export default AddMusyawarah;