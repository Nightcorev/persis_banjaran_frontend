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
    if (!formData.personal.nomorAnggota) {
      setMessage("Harap isi kolom Nomor Anggota.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.personal.nomorKTP) {
      setMessage("Harap isi kolom Nomor KTP.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.personal.namaLengkap) {
      setMessage("Harap isi kolom Nama Lengkap.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.personal.tempatLahir) {
      setMessage("Harap isi kolom Tempat Lahir.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.personal.tanggalLahir) {
      setMessage("Harap isi kolom Tanggal Lahir.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.personal.statusMerital) {
      setMessage("Harap isi kolom Status Merital.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.personal.nomorTelepon) {
      setMessage("Harap isi kolom Nomor Telepon.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.personal.nomorWA) {
      setMessage("Harap isi kolom Nomor WhatsApp.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.personal.alamat) {
      setMessage("Harap isi kolom Alamat KTP.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.personal.alamatTinggal) {
      setMessage("Harap isi kolom Alamat Tinggal.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.personal.otonom) {
      setMessage("Harap isi kolom Otonom.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.personal.jamaah) {
      setMessage("Harap isi kolom Jamaah.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.personal.statusAktif) {
      setMessage("Harap isi kolom Status Aktif.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.personal.tahunMasuk) {
      setMessage("Harap isi kolom Tahun Masuk.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.personal.masaAktif) {
      setMessage("Harap isi kolom Masa Aktif.");
      setIsModalOpen(true);
      return;
    }
  
    if (formData.personal.statusMerital === "Menikah" || formData.personal.statusMerital === "Duda"){
      if (!formData.family.jumlahTanggungan) {
        setMessage("Harap isi kolom Jumlah Tanggungan.");
        setIsModalOpen(true);
        return;
      }
      if (!formData.family.anggotaPersistri) {
        setMessage("Harap isi kolom Anggota Persistri.");
        setIsModalOpen(true);
        return;
      }
      if (!formData.family.namaIstri) {
        setMessage("Harap isi kolom Nama Istri.");
        setIsModalOpen(true);
        return;
      }
      if (!formData.family.statusKepemilikanRumah) {
        setMessage("Harap isi kolom Status Kepemilikan Rumah.");
        setIsModalOpen(true);
        return;
      }
      if (!formData.family.jumlaSeluruhAnak) {
        setMessage("Harap isi kolom Jumlah Seluruh Anak.");
        setIsModalOpen(true);
        return;
      }
      if (!formData.family.jumlaAnakPemuda) {
        setMessage("Harap isi kolom Jumlah Anak Pemuda.");
        setIsModalOpen(true);
        return;
      }
      if (!formData.family.jumlaAnakPemudi) {
        setMessage("Harap isi kolom Jumlah Anak Pemudi.");
        setIsModalOpen(true);
        return;
      }
    }
  
    // Validasi kolom education
    if (!formData.education.tingkat) {
      setMessage("Harap isi kolom Tingkat Pendidikan.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.education.namaSekolah) {
      setMessage("Harap isi kolom Nama Sekolah.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.education.jurusan) {
      setMessage("Harap isi kolom Jurusan.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.education.tahunMasuk) {
      setMessage("Harap isi kolom Tahun Masuk Pendidikan.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.education.tahunKeluar) {
      setMessage("Harap isi kolom Tahun Keluar Pendidikan.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.education.jenisPendidikan) {
      setMessage("Harap isi kolom Jenis Pendidikan.");
      setIsModalOpen(true);
      return;
    }
  
    // Validasi kolom work
    if (!formData.work.pekerjaan) {
      setMessage("Harap isi kolom Pekerjaan.");
      setIsModalOpen(true);
      return;
    }
    if (formData.work.pekerjaan === "Lainnya" && !formData.work.pekerjaanLainnya) {
      setMessage("Harap isi kolom Pekerjaan Lainnya.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.work.namaInstansi) {
      setMessage("Harap isi kolom Nama Instansi.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.work.deskripsiPekerjaan) {
      setMessage("Harap isi kolom Deskripsi Pekerjaan.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.work.pendapatan) {
      setMessage("Harap isi kolom Pendapatan.");
      setIsModalOpen(true);
      return;
    }
  
    // Validasi kolom skill
    if (!formData.skill.keterampilan) {
      setMessage("Harap isi kolom Keterampilan.");
      setIsModalOpen(true);
      return;
    }
    if (formData.skill.keterampilan === "Lainnya" && !formData.skill.keterampilanLainnya) {
      setMessage("Harap isi kolom Keterampilan Lainnya.");
      setIsModalOpen(true);
      return;
    }
    if (!formData.skill.deskripsiKeterampilan) {
      setMessage("Harap isi kolom Deskripsi Keterampilan.");
      setIsModalOpen(true);
      return;
    }
  
    // Validasi kolom interest
    if (!formData.interest || formData.interest.length === 0) {
      setMessage("Harap isi setidaknya satu Minat.");
      setIsModalOpen(true);
      return;
    }
    for (let minat of formData.interest) {
      if (minat.minat === "Lainnya" && !minat.minatLainnya) {
        setMessage("Harap isi kolom Minat Lainnya.");
        setIsModalOpen(true);
        return;
      }
    }
  
    if (!formData.organization.keterlibatanOrganisasi) {
      setMessage("Harap isi kolom Keterlibatan Organisasi.");
      setIsModalOpen(true);
      return;
    }
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
        setMessage(isEditMode ? "Data berhasil diperbarui!" : "Data berhasil disimpan!");
      } else {
        const errorData = await response.json();
        setMessage("Terjadi kesalahan: " + errorData.message);
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat menyimpan data.");
    }
    setIsModalOpen(true); // Tampilkan popup setelah mengubah message
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
