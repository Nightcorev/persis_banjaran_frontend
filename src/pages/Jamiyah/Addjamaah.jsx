import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FieldAlert from "../../components/FieldAlert";
import api from "../../utils/api";

const AddJamaah = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    master_jamaah: {
      nama_jamaah: "",
      alamat: "",
      aktif: true,
      lokasi_map: "",
    },
    monografi: {
      jum_persistri: "",
      jum_pemuda: "",
      jum_pemudi: "",
      jum_mubaligh: "",
      jum_asatidz: "",
      jum_santri_ra: "",
      jum_santri_md: "",
      jum_santri_mi: "",
      jum_santri_tsn: "",
      jum_santri_smp: "",
      jum_santri_ma: "",
    }
  });

  useEffect(() => {
  const fetchJamaahData = async () => {
    if (isEditMode) {
      setIsLoading(true);
      try {
        const response = await api.get(`/jamaah-monografi/${id}`);
        console.log('Response:', response.data);
        
        if (response.data.success) {
          const jamaahData = response.data.data;
          setFormData({
            master_jamaah: {
              nama_jamaah: jamaahData.nama_jamaah || "",
              alamat: jamaahData.alamat || "",
              aktif: jamaahData.aktif ?? true,
              lokasi_map: jamaahData.lokasi_map || "",
            },
            monografi: {
              jum_persistri: jamaahData.monografi?.jum_persistri ?? "",
              jum_pemuda: jamaahData.monografi?.jum_pemuda ?? "",
              jum_pemudi: jamaahData.monografi?.jum_pemudi ?? "",
              jum_mubaligh: jamaahData.monografi?.jum_mubaligh ?? "",
              jum_asatidz: jamaahData.monografi?.jum_asatidz ?? "",
              jum_santri_ra: jamaahData.monografi?.jum_santri_ra ?? "",
              jum_santri_md: jamaahData.monografi?.jum_santri_md ?? "",
              jum_santri_mi: jamaahData.monografi?.jum_santri_mi ?? "",
              jum_santri_tsn: jamaahData.monografi?.jum_santri_tsn ?? "",
              jum_santri_smp: jamaahData.monografi?.jum_santri_smp ?? "",
              jum_santri_ma: jamaahData.monografi?.jum_santri_ma ?? "",
            }
          });
        } else {
          setMessage(response.data.message || "Data tidak ditemukan");
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage(error.response?.data?.message || "Gagal mengambil data");
        setIsModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  fetchJamaahData();
}, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const { master_jamaah } = formData;
    
    if (!master_jamaah.nama_jamaah.trim()) {
      setMessage("Harap isi nama jamaah");
      setIsModalOpen(true);
      return false;
    }
    if (!master_jamaah.alamat.trim()) {
      setMessage("Harap isi alamat jamaah");
      setIsModalOpen(true);
      return false;
    }
    if (!master_jamaah.lokasi_map.trim()) {
      setMessage("Harap isi URL lokasi Google Maps");
      setIsModalOpen(true);
      return false;
    }
    
    // Validate Google Maps URL format
    const mapUrlPattern = /^https:\/\/(www\.)?(google\.com\/maps|maps\.google\.com|maps\.app\.goo\.gl)/;
    if (!mapUrlPattern.test(master_jamaah.lokasi_map)) {
      setMessage("URL Google Maps tidak valid");
      setIsModalOpen(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api[isEditMode ? 'put' : 'post'](
        isEditMode ? `/jamaah-monografi/${id}` : '/jamaah-monografi',
        formData
      );
      
      if (response.data?.success) {
        setMessage(isEditMode ? "Data jamaah berhasil diperbarui!" : "Data jamaah berhasil ditambahkan!");
        setIsModalOpen(true);
        setTimeout(() => {
          navigate('/jamiyah/data-jamiyah');
        }, 1500);
      } else {
        throw new Error(response.data?.message || "Terjadi kesalahan");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} data jamaah`);
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="border-b border-green-100 pb-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-green-800">
            {isEditMode ? "Edit Jamaah" : "Tambah Jamaah"}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors shadow-sm flex items-center justify-center w-full md:w-auto"
            >
              <span className="mr-1">←</span> Kembali
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
        {/* Master Jamaah Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-green-800">Data Jamaah</h3>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-800">
              Nama Jamaah <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="master_jamaah.nama_jamaah"
              value={formData.master_jamaah.nama_jamaah}
              onChange={handleChange}
              className="border border-green-200 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="Masukkan nama jamaah"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-800">
              Alamat <span className="text-red-500">*</span>
            </label>
            <textarea
              name="master_jamaah.alamat"
              value={formData.master_jamaah.alamat}
              onChange={handleChange}
              className="border border-green-200 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              rows="3"
              placeholder="Masukkan alamat lengkap"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-800">
              URL Google Maps <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="master_jamaah.lokasi_map"
              value={formData.master_jamaah.lokasi_map}
              onChange={handleChange}
              className="border border-green-200 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="https://maps.google.com/..."
            />
            <p className="text-xs text-gray-500">
              Masukkan URL Google Maps lokasi jamaah
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-800">
              Status Aktif
            </label>
            <select
              name="master_jamaah.aktif"
              value={formData.master_jamaah.aktif}
              onChange={(e) => handleChange({
                target: {
                  name: 'master_jamaah.aktif',
                  value: e.target.value === 'true'
                }
              })}
              className="border border-green-200 p-2 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            >
              <option value={true}>Aktif</option>
              <option value={false}>Tidak Aktif</option>
            </select>
          </div>
        </div>

        {/* Monografi Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-green-800">Data Monografi</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData.monografi).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="block text-sm font-medium text-green-800">
                  {key.split('_').map(word => word.toUpperCase()).join(' ').replace('JUM ', '')}
                </label>
                <input
                  type="number"
                  name={`monografi.${key}`}
                  value={value}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="border border-green-200 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Footer */}
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

export default AddJamaah;