import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FieldAlert from "../../components/FieldAlert";
import api from "../../utils/api";

const AddTasykil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    tgl_pelaksanaan: "",
    tgl_akhir_jihad: "",
    aktif: true,
    tingkat_musyawarah: "pimpinan_cabang",
    no_sk: "",
    id_anggota: "",
  });

  const [anggotaList, setAnggotaList] = useState([]);
  const [selectedAnggota, setSelectedAnggota] = useState(null);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch all anggota
  useEffect(() => {
    const fetchAnggota = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/anggota/all');
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
            
            // Set selected anggota from the data
            if (ketuaData?.id_anggota) {
              const selectedAnggotaData = anggotaList.find(
                anggota => anggota.id_anggota === ketuaData.id_anggota
              );
              setSelectedAnggota(selectedAnggotaData);
            }
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
  }, [id, isEditMode, anggotaList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectAnggota = (anggota) => {
    setSelectedAnggota(anggota);
    setFormData(prev => ({
      ...prev,
      id_anggota: anggota.id_anggota
    }));
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const filteredAnggota = searchTerm
    ? anggotaList.filter(anggota => 
        anggota.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()))
    : anggotaList;

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
        {/* Ketua Selection with Search */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-green-800">
            Ketua <span className="text-red-500">*</span>
          </label>
          <div className="relative" ref={dropdownRef}>
            <div className="flex">
              <input
                type="text"
                value={selectedAnggota ? selectedAnggota.nama_lengkap : searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedAnggota(null);
                  setFormData(prev => ({...prev, id_anggota: ""}));
                  setIsDropdownOpen(true);
                }}
                onClick={() => setIsDropdownOpen(true)}
                placeholder="Cari nama ketua..."
                className="border border-green-200 p-2 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-green-600 text-white px-3 rounded-r-md hover:bg-green-700"
              >
                {isDropdownOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </div>
            
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-green-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="p-3 text-center text-gray-500">Loading...</div>
                ) : filteredAnggota.length > 0 ? (
                  filteredAnggota.map(anggota => (
                    <div
                      key={anggota.id_anggota}
                      className="p-3 hover:bg-green-50 cursor-pointer border-b border-green-100 last:border-b-0"
                      onClick={() => handleSelectAnggota(anggota)}
                    >
                      {anggota.nama_lengkap}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">Tidak ada anggota ditemukan</div>
                )}
              </div>
            )}
          </div>
          {selectedAnggota && (
            <p className="text-xs text-green-600">ID Anggota: {selectedAnggota.id_anggota}</p>
          )}
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