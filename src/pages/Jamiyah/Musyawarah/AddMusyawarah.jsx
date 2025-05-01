import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FieldAlert from "../../../components/FieldAlert";

const AddMusyawarah = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    id_master_jamaah: "",
    tgl_pelaksanaan: "",
    tgl_akhir_jihad: "",
    aktif: "1",
  });

  const [jamaahList, setJamaahList] = useState([]);
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

  // Fetch data musyawarah jika dalam mode edit
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      fetch(`http://localhost:8000/api/get_musyawarah/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            id_master_jamaah: data.id_master_jamaah || "",
            tgl_pelaksanaan: data.tgl_pelaksanaan || "",
            tgl_akhir_jihad: data.tgl_akhir_jihad || "",
            aktif: data.aktif || "1",
          });
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
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
    if (!formData.id_master_jamaah) {
      setMessage("Harap pilih Jamaah.");
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
      const response = await fetch(
        isEditMode
          ? `http://localhost:8000/api/edit_musyawarah/${id}`
          : "http://localhost:8000/api/add_musyawarah",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setMessage(isEditMode ? "Data berhasil diperbarui!" : "Data berhasil disimpan!");
        navigate("/jamiyah/musyawarah/data-musyawarah");
      } else {
        const errorData = await response.json();
        setMessage("Terjadi kesalahan: " + errorData.message);
        setIsModalOpen(true);
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat menyimpan data.");
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
        <div className="space-y-1">
          <label className="block text-sm font-medium text-green-800">Nama Jamaah <span className="text-red-500">*</span></label>
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

        {/* Status Aktif */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-green-800">Status Aktif</label>
          <select
            name="aktif"
            value={formData.aktif}
            onChange={handleChange}
            className="border border-green-200 p-2 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          >
            <option value="1">Aktif</option>
            <option value="0">Tidak Aktif</option>
          </select>
          <p className="text-xs text-gray-500">Tentukan status aktif untuk musyawarah ini</p>
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