import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FieldAlert from "../../components/FieldAlert";
import api from "../../utils/api";

const AddTasykil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    tgl_pelaksanaan: "",
    tgl_akhir_jihad: "",
    aktif: true,
    tingkat_musyawarah: "pimpinan_cabang",
    no_sk: "",
    id_anggota: "",
  });

  const [anggotaList, setAnggotaList] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all anggota
  useEffect(() => {
    const fetchAnggota = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/anggota/all'); // Use the /all endpoint
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
    };

    fetchAnggota();
  }, []);

  // Fetch existing data in edit mode
  useEffect(() => {
    const fetchTasykil = async () => {
      if (isEditMode) {
        setIsLoading(true);
        try {
          const response = await api.get(`/detail_musyawarah/${id}`);
          if (response.data?.status === 200 && response.data?.data?.data?.[0]) {
            const tasykiData = response.data.data.data[0];
            const ketuaData = tasykiData.musyawarah_detail?.find(
              detail => detail.jabatan === "Ketua"
            );

            setFormData({
              id_master_jamaah: null,
              tgl_pelaksanaan: tasykiData.tgl_pelaksanaan || "",
              tgl_akhir_jihad: tasykiData.tgl_akhir_jihad || "",
              aktif: tasykiData.aktif ?? true,
              tingkat_musyawarah: "pimpinan_cabang",
              no_sk: tasykiData.no_sk || "",
              id_anggota: ketuaData?.id_anggota || "",
            });
          }
        } catch (error) {
          setMessage("Gagal mengambil data");
          setIsModalOpen(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTasykil();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.id_anggota) {
      setMessage("Harap pilih Ketua.");
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
    return true;
  };

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

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg">
      {/* Card Header */}
      <div className="border-b border-green-100 pb-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-green-800">
            {isEditMode ? "Edit Tasykil" : "Tambah Tasykil"}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors shadow-sm flex items-center justify-center w-full md:w-auto"
            >
              <span className="mr-1">←</span> Kembali
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors shadow-sm flex items-center justify-center w-full md:w-auto disabled:opacity-70"
            >
              {isLoading ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex flex-col gap-6">
        {/* Ketua Selection */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-green-800">
            Ketua <span className="text-red-500">*</span>
          </label>
          <select
            name="id_anggota"
            value={formData.id_anggota}
            onChange={handleChange}
            className="border border-green-200 p-2 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          >
            <option value="">Pilih Ketua</option>
            {anggotaList.map((anggota) => (
              <option key={anggota.id_anggota} value={anggota.id_anggota}>
                {anggota.nama_lengkap}
              </option>
            ))}
          </select>
        </div>

        {/* Tanggal Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-800">
              Tanggal Pelaksanaan <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="tgl_pelaksanaan"
              value={formData.tgl_pelaksanaan}
              onChange={handleChange}
              className="border border-green-200 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-800">
              Tanggal Akhir Jihad <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="tgl_akhir_jihad"
              value={formData.tgl_akhir_jihad}
              onChange={handleChange}
              className="border border-green-200 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Nomor SK */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-green-800">
            Nomor SK
          </label>
          <input
            type="text"
            name="no_sk"
            value={formData.no_sk}
            onChange={handleChange}
            placeholder="Contoh: SK-002/PW/2024 (Opsional)"
            className="border border-green-200 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
          <p className="text-xs text-gray-500">Nomor SK bersifat opsional</p>
        </div>

        {/* Status Aktif */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-green-800">
            Status
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

export default AddTasykil;