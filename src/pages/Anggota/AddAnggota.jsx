import { useState } from "react";
import InputDataPribadi from "./section/InputDataPribadi";
import InputDataPendidikan from "./section/InputDataPendidikan";
import InputDataPekerjaanKeterampilan from "./section/InputDataPekerjaanKeterampilan";
import InputDataOrganisasi from "./section/InputDataOrganisasi";
import InputDataTraining from "./section/InputDataTraining";

const sections = [
  { key: "personal", label: "Data Pribadi" },
  { key: "education", label: "Data Pendidikan" },
  { key: "work", label: "Data Pekerjaan dan Keterampilan" },
  { key: "organization", label: "Data Organisasi" },
  { key: "training", label: "Data Training" },
];

const AddAnggota = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [nomorAnggota, setNomorAnggota] = useState("");
  const [formData, setFormData] = useState({
    personal: {},
    education: [],
    work: [],
    organization: [],
    training: [],
  });

  // Fungsi untuk menangani perubahan data dari masing-masing form
  const handleDataChange = (section, newData) => {
    setFormData((prevState) => ({
      ...prevState,
      [section]: newData,
    }));
  };

  const renderForm = () => {
    switch (activeSection) {
      case "personal":
        return <InputDataPribadi data={formData.personal} onDataChange={(fieldName, value) => handleDataChange("personal", { ...formData.personal, [fieldName]: value })} nomorAnggota={nomorAnggota} setNomorAnggota={setNomorAnggota} />;
      case "education":
        return <InputDataPendidikan data={formData.education} onDataChange={(newData) => handleDataChange("education", newData)} nomorAnggota={nomorAnggota} />;
      case "work":
        return <InputDataPekerjaanKeterampilan data={formData.work} onDataChange={(newData) => handleDataChange("work", newData)} nomorAnggota={nomorAnggota} />;
      case "organization":
        return <InputDataOrganisasi data={formData.organization} onDataChange={(newData) => handleDataChange("organization", newData)} nomorAnggota={nomorAnggota} />;
      case "training":
        return <InputDataTraining data={formData.training} onDataChange={(newData) => handleDataChange("training", newData)} nomorAnggota={nomorAnggota} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Tambah Anggota</h2>
        <button className="p-4 bg-green-600 text-white py-2 rounded-md" onClick={() => console.log(formData)}>Simpan</button>
      </div>

      <ul className="flex w-full justify-between border-b pb-2 text-sm">
        {sections.map((section) => (
          <li key={section.key} className={`cursor-pointer p-1 border-b-2 ${activeSection === section.key ? "border-blue-500" : "border-transparent"}`} onClick={() => setActiveSection(section.key)}>
            {section.label}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-col w-full">{renderForm()}</div>
    </div>
  );
};

export default AddAnggota;
