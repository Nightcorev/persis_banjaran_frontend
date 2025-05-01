import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FieldAlert from "../../../components/FieldAlert";

// Import API_URL
const API_URL = import.meta.env.VITE_API_BASE_URL;

const AddMusyawarah = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    id_master_jamaah: "",
    tgl_pelaksanaan: "",
    tgl_akhir_jihad: "",
    aktif: true,
    id_anggota: "", // Added new field
  });

  const [jamaahList, setJamaahList] = useState([]);
  const [anggotaList, setAnggotaList] = useState([]); // New state for anggota list
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data jamaah
  useEffect(() => {
    fetch("http://localhost:8000/api/data_jamaah")
      .then((res) => res.json())
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setJamaahList(response.data.data);
        } else {
          console.error("Data Jamaah tidak valid:", response);
        }
      })
      .catch((err) => console.error("Gagal ambil data jamaah:", err));
  }, []);

  // Fetch anggota when jamaah is selected
  useEffect(() => {
    if (formData.id_master_jamaah) {
      setIsLoading(true);
      fetch(`http://localhost:8000/api/anggota/by-jamaah/${formData.id_master_jamaah}`)
        .then((res) => res.json())
        .then((response) => {
          if (response.status === 200 && response.data) {
            setAnggotaList(response.data.data || []);
          } else {
            console.error("Data Anggota tidak valid:", response);
            setAnggotaList([]);
          }
        })
        .catch((err) => {
          console.error("Gagal ambil data anggota:", err);
          setAnggotaList([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setAnggotaList([]); // Reset anggota list when no jamaah is selected
    }
  }, [formData.id_master_jamaah]);

  // Modify the useEffect for fetching musyawarah data in edit mode
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      fetch(`${API_URL}/detail_musyawarah/${id}`)
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200 && response.data?.data?.[0]) {
            // Get the first item from data array
            const musyawarahData = response.data.data[0];
            const ketuaData = musyawarahData.musyawarah_detail.anggota?.find(
              detail => detail.jabatan === "Ketua"
            );

            setFormData({
              id_master_jamaah: musyawarahData.id_master_jamaah || "",
              tgl_pelaksanaan: musyawarahData.tgl_pelaksanaan || "",
              tgl_akhir_jihad: musyawarahData.tgl_akhir_jihad || "", 
              aktif: musyawarahData.aktif ?? true,
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
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setMessage("Gagal mengambil data");
          setIsModalOpen(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
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
    return true;
  };

  // Modifikasi handleSubmit untuk menggunakan API_URL
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        isEditMode
          ? `${API_URL}/edit_musyawarah/${id}`
          : `${API_URL}/add_musyawarah`,
        {
          method: isEditMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setMessage(isEditMode ? "Data berhasil diperbarui!" : "Data berhasil disimpan!");
        navigate("/jamiyah/musyawarah/data-musyawarah");
      } else {
        throw new Error(data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan: " + error.message);
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

  const renderJamaahField = () => {
    if (isEditMode) {
      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-green-800">
            Nama Jamaah
          </label>
          <input
            type="text"
            value=""
            disabled
            className="border border-green-200 p-2 rounded-md w-full bg-gray-50"
            placeholder="Data jamaah tidak dapat diubah dalam mode edit"
          />
          <p className="text-xs text-gray-500">
            Nama jamaah tidak dapat diubah dalam mode edit
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-green-800">
          Nama Jamaah <span className="text-red-500">*</span>
        </label>
        <select
          name="id_master_jamaah"
          value={formData.id_master_jamaah}
          onChange={handleChange}
          className="border border-green-200 p-2 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
        >
          <option value="">Pilih Jamaah</option>
          {Array.isArray(jamaahList) &&
            jamaahList.map((jamaah) => (
              <option key={jamaah.id_master_jamaah} value={jamaah.id_master_jamaah}>
                {jamaah.nama_jamaah}
              </option>
            ))}
        </select>
        <p className="text-xs text-gray-500">Pilih jamaah dari daftar yang tersedia</p>
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
            <a href="/jamiyah/musyawarah/data-musyawarah">
              <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors shadow-sm flex items-center justify-center w-full md:w-auto">
                <span className="mr-1">←</span> Kembali
              </button>
            </a>
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
        {/* Nama Jamaah */}
        {renderJamaahField()}

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
            Tentukan status aktif untuk musyawarah ini
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