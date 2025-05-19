import { useState, useEffect, useRef } from "react"; // Add useRef
import { useParams, useNavigate, useLocation } from "react-router-dom";
import FieldAlert from "../../../components/FieldAlert";
import api from "../../../utils/api";

const AddMusyawarah = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);
  const dropdownRef = useRef(null); // Add ref for dropdown

  const [formData, setFormData] = useState({
    id_master_jamaah: location.state?.id_master_jamaah || "",
    tgl_pelaksanaan: "",
    tgl_akhir_jihad: "",
    aktif: true,
    tingkat_musyawarah: "jamaah",
    no_sk: "",
    id_anggota: "",
  });

  const [anggotaList, setAnggotaList] = useState([]);
  const [filteredAnggotaList, setFilteredAnggotaList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Replace showSearch with isDropdownOpen
  const [selectedAnggota, setSelectedAnggota] = useState(null); // Add selected anggota state
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

  // Fetch anggota
  useEffect(() => {
    const fetchAnggota = async () => {
      if (formData.id_master_jamaah) {
        setIsLoading(true);
        try {
          const response = await api.get(`/anggota/choice_by-jamaah/${formData.id_master_jamaah}`);
          if (response.data?.data) {
            const anggotaData = response.data.data;
            setAnggotaList(anggotaData);
            setFilteredAnggotaList(anggotaData);
          } else {
            console.error("Data Anggota tidak valid:", response);
            setAnggotaList([]);
            setFilteredAnggotaList([]);
          }
        } catch (err) {
          console.error("Gagal ambil data anggota:", err);
          setAnggotaList([]);
          setFilteredAnggotaList([]);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    fetchAnggota();
  }, [formData.id_master_jamaah]);

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

  // Fetch musyawarah data in edit mode
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
              setFilteredAnggotaList([ketuaData.anggota]);
              setSelectedAnggota(ketuaData.anggota); // Set selected anggota
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
    setSelectedAnggota(null); // Clear selected anggota when searching
    setFormData(prev => ({...prev, id_anggota: ""}));
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
        
        {/* Search input with dropdown (similar to AddTasykil) */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex">
            <input
              type="text"
              value={selectedAnggota ? selectedAnggota.nama_lengkap : searchTerm}
              onChange={handleSearchChange}
              onClick={() => formData.id_master_jamaah && setIsDropdownOpen(true)}
              placeholder={formData.id_master_jamaah ? "Cari nama ketua..." : "Pilih jamaah terlebih dahulu"}
              className="border border-green-200 p-2 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              disabled={!formData.id_master_jamaah || isLoading}
            />
            <button
              onClick={() => formData.id_master_jamaah && setIsDropdownOpen(!isDropdownOpen)}
              disabled={!formData.id_master_jamaah || isLoading}
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
          {isDropdownOpen && formData.id_master_jamaah && (
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
        {!formData.id_master_jamaah ? (
          <p className="text-xs text-gray-500">
            Pilih jamaah terlebih dahulu untuk melihat daftar anggota
          </p>
        ) : anggotaList.length === 0 ? (
          <p className="text-xs text-gray-500">
            Tidak ada anggota terdaftar untuk jamaah ini
          </p>
        ) : selectedAnggota ? (
          <p className="text-xs text-green-600">
            ID Anggota: {selectedAnggota.id_anggota}
          </p>
        ) : (
          <p className="text-xs text-gray-500">
            Ketikkan nama atau NIK untuk mencari anggota
          </p>
        )}
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
        {/* Ketua Jamaah select with improved search */}
        {renderKetuaJamaahField()}
        
        {/* Tanggal (side by side) */}
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
            <p className="text-xs text-gray-500">
              Masukkan tanggal saat musyawarah dilaksanakan
            </p>
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
            <p className="text-xs text-gray-500">
              Masukkan tanggal akhir jihad yang direncanakan
            </p>
          </div>
        </div>

        {/* New fields */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-green-800">
              Nomor SK
            </label>
            <input
              type="text"
              name="no_sk"
              value={formData.no_sk}
              onChange={handleChange}
              maxLength={100}
              className="border border-green-200 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="Masukkan nomor SK"
            />
            <p className="text-xs text-gray-500">
              Opsional, maksimal 100 karakter
            </p>
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