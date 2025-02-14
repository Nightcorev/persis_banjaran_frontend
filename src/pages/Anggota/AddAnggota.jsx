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

  const renderForm = () => {
    switch (activeSection) {
      case "personal":
        return <InputDataPribadi nomorAnggota={nomorAnggota} setNomorAnggota={setNomorAnggota} />;
      case "education":
        return <InputDataPendidikan nomorAnggota={nomorAnggota} />;
      case "work":
        return <InputDataPekerjaanKeterampilan nomorAnggota={nomorAnggota} />;
      case "organization":
        return <InputDataOrganisasi nomorAnggota={nomorAnggota} />;
      case "training":
        return <InputDataTraining nomorAnggota={nomorAnggota} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-4">Tambah Anggota</h2>
      <ul className="flex w-full justify-between border-b pb-2 text-sm">
        {sections.map((section) => (
          <li
            key={section.key}
            className={`cursor-pointer p-1 border-b-2 ${
              activeSection === section.key ? "border-blue-500" : "border-transparent"
            }`}
            onClick={() => setActiveSection(section.key)}
          >
            {section.label}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-col w-full">{renderForm()}</div>
      <div className="flex flex-row-reverse">
        <button className="mt-4 p-4 bg-green-600 text-white py-2 rounded-md">Simpan</button>
      </div>
    </div>
  );
};

export default AddAnggota;
