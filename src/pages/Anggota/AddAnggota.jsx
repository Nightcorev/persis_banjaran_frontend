import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
      fetch(`http://127.0.0.1:8000/api/get_anggota/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData(data);
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

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        isEditMode
          ? `http://127.0.0.1:8000/api/edit_anggota/${id}`
          : "http://127.0.0.1:8000/api/add_anggota",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setMessage("Data berhasil disimpan!");
      } else {
        const errorData = await response.json();
        setMessage("Terjadi kesalahan: " + errorData.message);
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{isEditMode ? "Edit Anggota" : "Tambah Anggota"}</h2>
        <button className="p-4 bg-green-600 text-white py-2 rounded-md" onClick={handleSubmit}>Simpan</button>
      </div>
      <ul className="flex w-full justify-between border-b pb-2 text-sm">
        {sections.map((section) => (
          <li key={section.key} className={`cursor-pointer p-1 border-b-2 ${activeSection === section.key ? "border-blue-500" : "border-transparent"}`} onClick={() => setActiveSection(section.key)}>
            {section.label}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-col w-full">
        {activeSection === "personal" && <InputDataPribadi data={formData.personal} onDataChange={(fieldName, value) => handleDataChange("personal", { ...formData.personal, [fieldName]: value })} nomorAnggota={nomorAnggota} setNomorAnggota={setNomorAnggota} />}
        {activeSection === "education" && <InputDataPendidikan data={formData.education} onDataChange={(newData) => handleDataChange("education", newData)} />}
        {activeSection === "work" && <InputDataPekerjaan data={formData.work} onDataChange={(newData) => handleDataChange("work", newData)} />}
        {activeSection === "skill" && <InputDataKeterampilan data={formData.skill} onDataChange={(newData) => handleDataChange("skill", newData)} />}
        {activeSection === "interest" && <InputDataMinat data={formData.interest} onDataChange={(newData) => handleDataChange("interest", newData)} />}
        {activeSection === "organization" && <InputDataOrganisasi data={formData.organization} onDataChange={(newData) => handleDataChange("organization", newData)} />}
        {activeSection === "family" && <InputDataKeluarga data={formData.family} onDataChange={(newData) => handleDataChange("family", newData)} />}
      </div>
      <FieldAlert isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message={message} />
    </div>
  );
};

export default AddAnggota;
