import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api"; // Import the API utility
import InputDataPribadi from "./section/InputDataPribadi";
import InputDataPendidikan from "./section/InputDataPendidikan";
import InputDataPekerjaan from "./section/InputDataPekerjaan";
import InputDataKeterampilan from "./section/InputDataKeterampilan";
import InputDataMinat from "./section/InputDataMinat";
import InputDataOrganisasi from "./section/InputDataOrganisasi";
import InputDataKeluarga from "./section/InputDataKelurga";
import FieldAlert from "../../components/FieldAlert";

const sections = [
  { key: "personal", label: "Data Pribadi" },
  { key: "family", label: "Data Keluarga" },
  { key: "education", label: "Data Pendidikan" },
  { key: "work", label: "Data Pekerjaan" },
  { key: "skill", label: "Data Keterampilan" },
  { key: "interest", label: "Data Minat" },
  { key: "organization", label: "Data Organisasi" },
];


const AddAnggota = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [activeSection, setActiveSection] = useState("personal");
  const [nomorAnggota, setNomorAnggota] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    personal: {},
    family: {},
    education: {},
    work: {},
    skill: {},
    interest: [],
    organization: {},
  });

  useEffect(() => {
    if (isEditMode) {
      api.get(`/get_anggota/${id}`)
        .then((response) => {
          setFormData(response.data);
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [id, isEditMode]);

  const handleDataChange = (section, newData) => {
    setFormData((prevState) => ({
      ...prevState,
      [section]: newData,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setMessage("Hanya file gambar yang diperbolehkan");
      setIsModalOpen(true);
      return;
    }
    
    if (file.size > 2048 * 1024) {
      setMessage("Ukuran file terlalu besar. Maksimal 2MB");
      setIsModalOpen(true);
      return;
    }

    const tempPreview = URL.createObjectURL(file);
    setImagePreview(tempPreview);
    
    setFormData(prevState => ({
      ...prevState,
      personal: {
        ...prevState.personal,
        foto: file,
        fotoURL: tempPreview
      }
    }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("namaFoto", file.name);

    try {
      const response = await api.post("/upload-foto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        console.log("Upload berhasil:", response.data);
        const fullUrl = `http://localhost:8000${response.data.path}`;
        
        setFormData(prevState => ({
          ...prevState,
          personal: {
            ...prevState.personal,
            foto: file,
            fotoURL: fullUrl,
            foto_path: response.data.path
          }
        }));
        
        URL.revokeObjectURL(tempPreview);
      } else {
        setMessage("Upload gagal: " + (response.data.message || "Unknown error"));
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Upload gagal:", error);
      setMessage("Terjadi kesalahan saat mengupload foto");
      setIsModalOpen(true);
      
      removeImage();
    }
  };
  
  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    
    setImagePreview(null);
    
    setFormData(prevState => ({
      ...prevState,
      personal: {
        ...prevState.personal,
        foto: null,
        fotoURL: null,
        foto_path: null
      }
    }));
  };

  const handleSubmit = async () => {
    if (!formData.personal.nomorAnggota) {
      setMessage("Harap isi kolom Nomor Anggota.");
      setIsModalOpen(true);
      return;
    }
    
    try {
      let response;
      if (isEditMode) {
        response = await api.put(`/edit_anggota/${id}`, formData);
      } else {
        response = await api.post("/add_anggota", formData);
      }
  
      setMessage(isEditMode ? "Data berhasil diperbarui!" : "Data berhasil disimpan!");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error saving data:", error);
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat menyimpan data.";
      setMessage("Terjadi kesalahan: " + errorMessage);
      setIsModalOpen(true);
    }
  };
  
  return (
    <div className="w-full bg-gray-50 rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-700 to-green-900 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {isEditMode ? "Edit Anggota" : "Tambah Anggota"}
          </h2>
          <div className="flex gap-3">
            <a href="/users/data-anggota">
              <button className="px-4 py-2 bg-white text-green-800 rounded-md hover:bg-gray-100 transition-colors shadow-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Kembali
              </button>
            </a>
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-sm flex items-center" 
              onClick={handleSubmit}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Simpan
            </button>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-full px-2 overflow-x-auto scrollbar-hide">
          <ul className="flex w-max space-x-2 py-3 px-2">
            {sections.map((section) => (
              <li 
                key={section.key} 
                className={`cursor-pointer px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap
                  ${activeSection === section.key 
                    ? "bg-green-700 text-white font-medium shadow-md" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"}
                `} 
                onClick={() => setActiveSection(section.key)}
              >
                {section.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-80 lg:w-96">
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-medium text-gray-800">Foto Anggota</h3>
              </div>
              <div className="p-4">
                <div className="relative rounded-lg overflow-hidden aspect-[3/4] bg-gray-100">
                  {formData.personal?.fotoURL ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={formData.personal.fotoURL}
                        alt="Foto Anggota" 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                        title="Hapus foto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <span className="mt-2 text-sm text-gray-400">Belum ada foto</span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label 
                    htmlFor="photo-upload" 
                    className="inline-block w-full px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg cursor-pointer text-sm text-center hover:bg-blue-100 transition"
                  >
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      {formData.personal?.fotoURL ? "Ganti Foto" : "Upload Foto"}
                    </span>
                  </label>
                  <input
                    id="photo-upload"
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="mt-2 text-xs text-gray-500">Format: JPG, PNG. Max size: 2MB</p>
                </div>
                
                {formData.personal?.foto && (
                  <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200 break-words">
                    <p className="font-medium">File dipilih:</p>
                    <p className="truncate">{formData.personal.foto.name}</p>
                    <p>{(formData.personal.foto.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-medium text-gray-800">{sections.find(s => s.key === activeSection)?.label}</h3>
              </div>
              <div className="p-6">
                {activeSection === "personal" && <InputDataPribadi data={formData.personal} onDataChange={(fieldName, value) => handleDataChange("personal", { ...formData.personal, [fieldName]: value })} nomorAnggota={nomorAnggota} setNomorAnggota={setNomorAnggota} />}
                {activeSection === "education" && <InputDataPendidikan data={formData.education} onDataChange={(newData) => handleDataChange("education", newData)} />}
                {activeSection === "work" && <InputDataPekerjaan data={formData.work} onDataChange={(newData) => handleDataChange("work", newData)} />}
                {activeSection === "skill" && <InputDataKeterampilan data={formData.skill} onDataChange={(newData) => handleDataChange("skill", newData)} />}
                {activeSection === "interest" && <InputDataMinat data={formData.interest} onDataChange={(newData) => handleDataChange("interest", newData)} />}
                {activeSection === "organization" && <InputDataOrganisasi data={formData.organization} onDataChange={(newData) => handleDataChange("organization", newData)} />}
                {activeSection === "family" && <InputDataKeluarga data={formData.family} onDataChange={(newData) => handleDataChange("family", newData)} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <FieldAlert isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message={message} />
    </div>
  );
};

export default AddAnggota;
