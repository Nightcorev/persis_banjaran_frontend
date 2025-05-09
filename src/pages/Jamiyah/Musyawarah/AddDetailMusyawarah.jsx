import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../../utils/api";

const AddDetailMusyawarah = () => {
  const { id, detailId } = useParams(); // Add detailId for edit mode
  const navigate = useNavigate();
  const location = useLocation();
  const id_master_jamaah = location.state?.id_master_jamaah || "";
  const isEditMode = Boolean(detailId); // Check if we're in edit mode

  const [formData, setFormData] = useState({
    id_master_jamaah: id_master_jamaah,
    id_anggota: "",
    jabatan: "",
    no_sk: "",
    aktif: true,
  });

  const [anggotaList, setAnggotaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Fetch anggota data
  useEffect(() => {
    setIsLoading(true);
    api.get('/anggota/all')
      .then((response) => {
        if (response.data.status === 200) {
          setAnggotaList(response.data.data || []);
        }
      })
      .catch((error) => {
        console.error("Error fetching anggota:", error);
        setMessage("Gagal mengambil data anggota");
        setMessageType("error");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Fetch detail data in edit mode
  useEffect(() => {
    if (isEditMode && detailId) {
      setIsLoading(true);
      api.get(`/musyawarah/detail/${id}/${detailId}`)
        .then((response) => {
          if (response.data.status === 200) {
            const detailData = response.data.data;
            setFormData({
              id_master_jamaah: detailData.id_master_jamaah || id_master_jamaah,
              id_anggota: detailData.id_anggota || "",
              jabatan: detailData.jabatan || "",
              no_sk: detailData.no_sk || "",
              aktif: detailData.aktif ?? true,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching detail:", error);
          setMessage("Gagal mengambil data detail");
          setMessageType("error");
        })
        .finally(() => setIsLoading(false));
    }
  }, [isEditMode, detailId, id_master_jamaah]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'aktif' ? value === 'true' : value,
    }));
  };

  const validateForm = () => {
    if (!formData.id_anggota) {
      setMessage("Harap pilih Anggota");
      setMessageType("error");
      return false;
    }
    if (!formData.jabatan) {
      setMessage("Harap isi Jabatan");
      setMessageType("error");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api[isEditMode ? 'put' : 'post'](
        isEditMode 
          ? `/musyawarah/detail/${id}/${detailId}` 
          : `/musyawarah/detail/${id}`,
        formData
      );

      if (response.data.status === (isEditMode ? 200 : 201)) {
        setMessage(isEditMode ? "Data berhasil diperbarui!" : "Data berhasil disimpan!");
        setMessageType("success");
        
        // Redirect after success
        setTimeout(() => {
          navigate(`/jamiyah/musyawarah/detail/${id}`);
        }, 2000);
      } else {
        throw new Error(response.data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Terjadi kesalahan saat menyimpan data");
      setMessageType("error");
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
            {isEditMode ? "Edit Detail Musyawarah" : "Tambah Detail Musyawarah"}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/jamiyah/musyawarah/detail/${id}`)}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors shadow-sm flex items-center"
            >
              <span className="mr-1">←</span> Kembali
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors shadow-sm disabled:opacity-70"
            >
              {isLoading ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 mb-6 rounded-md ${
            messageType === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* Form Content */}
      <div className="flex flex-col gap-6">
        {/* Pilih Anggota */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-green-800">
            Pilih Anggota <span className="text-red-500">*</span>
          </label>
          <select
            name="id_anggota"
            value={formData.id_anggota}
            onChange={handleChange}
            className="border border-green-200 p-2 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            disabled={isEditMode} // Disable in edit mode
          >
            <option value="">
              {isLoading ? "Memuat data anggota..." : "Pilih Anggota"}
            </option>
            {anggotaList.map((anggota) => (
              <option key={anggota.id_anggota} value={anggota.id_anggota}>
                {anggota.nama_lengkap}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            {isEditMode 
              ? "Anggota tidak dapat diubah dalam mode edit"
              : isLoading 
                ? "Memuat data..." 
                : `${anggotaList.length} anggota tersedia`
            }
          </p>
        </div>

        {/* Jabatan */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-green-800">
            Jabatan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="jabatan"
            value={formData.jabatan}
            onChange={handleChange}
            className="border border-green-200 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Masukkan jabatan"
          />
        </div>

        {/* Nomor SK */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-green-800">
            Nomor SK <span className="text-red-500"></span>
          </label>
          <input
            type="text"
            name="no_sk"
            value={formData.no_sk}
            onChange={handleChange}
            className="border border-green-200 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Masukkan nomor SK"
          />
        </div>

        {/* Status Aktif */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-green-800">
            Status Aktif
          </label>
          <select
            name="aktif"
            value={formData.aktif}
            onChange={handleChange}
            className="border border-green-200 p-2 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value={true}>Aktif</option>
            <option value={false}>Tidak Aktif</option>
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-green-100">
        <p className="text-sm text-gray-600">
          <span className="text-red-500">*</span> menandakan kolom yang wajib diisi
        </p>
      </div>
    </div>
  );
};

export default AddDetailMusyawarah;