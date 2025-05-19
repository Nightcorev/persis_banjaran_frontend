import { useState, useEffect, useRef } from "react"; // Added useRef
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../../utils/api";

const JABATAN_OPTIONS = [
  "Penasehat",
  "Ketua",
  "Wakil Ketua",
  "Sekretaris",
  "Wakil Sekretaris", 
  "Bendahara",
  "Wakil Bendahara",
  "Pembantu Umum"
];

const AddDetailMusyawarah = () => {
  const { id, detailId } = useParams(); // Add detailId for edit mode
  const navigate = useNavigate();
  const location = useLocation();
  const id_master_jamaah = location.state?.id_master_jamaah || "";
  const isPimpinanCabang = location.state?.isPimpinanCabang; // Add isPimpinanCabang from location state
  const isEditMode = Boolean(detailId); // Check if we're in edit mode
  const dropdownRef = useRef(null); // Add ref for dropdown

  const [formData, setFormData] = useState({
    id_master_jamaah: id_master_jamaah,
    id_anggota: "",
    jabatan: "",
    aktif: true,
  });

  const [anggotaList, setAnggotaList] = useState([]);
  const [filteredAnggotaList, setFilteredAnggotaList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAnggota, setSelectedAnggota] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

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

  // Filter anggota berdasarkan search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAnggotaList(anggotaList);
      return;
    }

    const filtered = anggotaList.filter(anggota => 
      anggota.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (anggota.nik && anggota.nik.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredAnggotaList(filtered);
  }, [searchTerm, anggotaList]);

  // Fetch anggota data
  useEffect(() => {
    const fetchAnggota = async () => {
      setIsLoading(true);
      try {
        // Use anggota/all endpoint for both add and edit when isPimpinanCabang is true
        const endpoint = isPimpinanCabang 
          ? '/anggota/all'
          : `/anggota/choice_by-jamaah/${id_master_jamaah}`;
        
        const response = await api.get(endpoint);
        if (response.data?.data) {
          setAnggotaList(response.data.data);
          setFilteredAnggotaList(response.data.data);
        }
      } catch (err) {
        console.error("Gagal ambil data anggota:", err);
        setMessage("Gagal mengambil data anggota");
        setMessageType("error");
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have id_master_jamaah for regular jamaah
    // or if it's pimpinan cabang (regardless of id_master_jamaah)
    if (isPimpinanCabang || id_master_jamaah) {
      fetchAnggota();
    }
  }, [id_master_jamaah, isPimpinanCabang]);

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
              aktif: detailData.aktif ?? true,
            });
            
            // Set selected anggota if available
            if (detailData.anggota) {
              setSelectedAnggota(detailData.anggota);
            }
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
    if (!isEditMode) {
      setSelectedAnggota(null);
      setFormData(prev => ({...prev, id_anggota: ""}));
    }
  };

  const handleSelectAnggota = (anggota) => {
    if (isEditMode) return;
    
    setSelectedAnggota(anggota);
    setFormData(prev => ({
      ...prev,
      id_anggota: anggota.id_anggota
    }));
    setIsDropdownOpen(false);
    setSearchTerm("");
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

  // Render the anggota selection field
  const renderAnggotaField = () => {
    if (isEditMode) {
      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-green-800">
            Pilih Anggota <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={selectedAnggota ? selectedAnggota.nama_lengkap : ""}
            disabled
            className="border border-green-200 p-2 rounded-md w-full bg-gray-50"
            placeholder="Data anggota tidak dapat diubah"
          />
          <p className="text-xs text-gray-500">
            Anggota tidak dapat diubah dalam mode edit
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-green-800">
          Pilih Anggota <span className="text-red-500">*</span>
        </label>
        
        {/* Search input with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex">
            <input
              type="text"
              value={selectedAnggota ? selectedAnggota.nama_lengkap : searchTerm}
              onChange={handleSearchChange}
              onClick={() => setIsDropdownOpen(true)}
              placeholder="Cari nama anggota..."
              className="border border-green-200 p-2 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isLoading}
              className="bg-green-600 text-white px-3 rounded-r-md hover:bg-green-700 disabled:bg-gray-300"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : isDropdownOpen ? (
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
          
          {/* Dropdown results */}
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-green-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-3 text-center text-gray-500">Loading...</div>
              ) : filteredAnggotaList.length > 0 ? (
                filteredAnggotaList.map(anggota => (
                  <div
                    key={anggota.id_anggota}
                    className="p-3 hover:bg-green-50 cursor-pointer border-b border-green-100 last:border-b-0"
                    onClick={() => handleSelectAnggota(anggota)}
                  >
                    <div className="font-medium">{anggota.nama_lengkap}</div>
                    {anggota.nik && (
                      <div className="text-xs text-gray-500">NIK: {anggota.nik}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  Tidak ada anggota ditemukan
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Helper text */}
        {isLoading ? (
          <p className="text-xs text-gray-500">
            Memuat data...
          </p>
        ) : selectedAnggota ? (
          <p className="text-xs text-green-600">
            ID Anggota: {selectedAnggota.id_anggota}
          </p>
        ) : anggotaList.length > 0 ? (
          <p className="text-xs text-gray-500">
            {filteredAnggotaList.length} anggota tersedia{searchTerm ? " dari pencarian" : ""}
          </p>
        ) : (
          <p className="text-xs text-gray-500">
            Tidak ada data anggota untuk jamaah ini
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="border-b border-green-100 pb-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-green-800">
            {isEditMode 
              ? `Edit ${isPimpinanCabang ? 'Anggota Tasykil' : 'Anggota Musyawarah'}`
              : `Tambah ${isPimpinanCabang ? 'Anggota Tasykil' : 'Anggota Musyawarah'}`}
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
        {/* Pilih Anggota with search */}
        {renderAnggotaField()}

        {/* Jabatan */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-green-800">
            Jabatan <span className="text-red-500">*</span>
          </label>
          <select
            name="jabatan"
            value={formData.jabatan}
            onChange={handleChange}
            className="border border-green-200 p-2 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Pilih Jabatan</option>
            {JABATAN_OPTIONS.map((jabatan) => (
              <option key={jabatan} value={jabatan}>
                {jabatan}
              </option>
            ))}
          </select>
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