import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ViewAnggota = () => {
    const { id } = useParams();
    const [photo, setPhoto] = useState("");
  const [activeTab, setActiveTab] = useState("Personal");
  const [anggotaData, setAnggotaData] = useState(null);

  useEffect(() => {
    const fetchAnggotaData = async () => {
      console.log('ID:', id);
      console.log('ID Type:', typeof id);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/get_anggota/${id}`);
        const data = await response.json();
        setAnggotaData(data); // Save the data to the state
        setPhoto(data.personal.fotoURL);
        console.log(data);
      } catch (error) {
        console.error("Error fetching anggota data:", error);
      }
    };

    fetchAnggotaData();
  }, [id]);  // Runs every time `id` changes

  if (!anggotaData) return <div>Loading...</div>; // Display a loading state while data is being fetched

  const tabData = {
    Personal: [
      { label: "Nomor Anggota", value: anggotaData.personal.nomorAnggota },
      { label: "Nomor KTP", value: anggotaData.personal.nomorKTP },
      { label: "Nama Lengkap", value: anggotaData.personal.namaLengkap },
      { label: "Tempat Lahir", value: anggotaData.personal.tempatLahir },
      { label: "Tanggal Lahir", value: anggotaData.personal.tanggalLahir },
      { label: "Status Pernikahan", value: anggotaData.personal.statusMerital },
      { label: "Nomor Telepon", value: anggotaData.personal.nomorTelepon },
      { label: "Nomor WA", value: anggotaData.personal.nomorWA },
      { label: "Alamat KTP", value: anggotaData.personal.alamat },
      { label: "Alamat Tinggal", value: anggotaData.personal.alamatTinggal },
      { label: "Otonom", value: anggotaData.personal.namaOtonom },
      { label: "Jamaah", value: anggotaData.personal.namaJamaah },
      { label: "Status Aktif", value: anggotaData.personal.namaStatusAktif },
      { label: "Tahun Masuk Anggota", value: anggotaData.personal.tahunMasuk },
      { label: "Masa Aktif Anggota", value: anggotaData.personal.masaAktif },
      { label: "Kajian Rutin", value: anggotaData.personal.kajianRutin },
      { label: "Tahun Haji", value: anggotaData.personal.tahunHaji },
      { label: "Keterangan", value: anggotaData.personal.keterangan },
    ],
    Family: [
      { label: "Jumlah Tanggungan", value: anggotaData.family.jumlahTanggungan },
      { label: "Nama Istri", value: anggotaData.family.namaIstri },
      { label: "Istri Persistri", value: anggotaData.family.anggotaPersistri },
      { label: "Status Kepemilikian Rumah", value: anggotaData.family.statusKepemilikanRumah },
      { label: "Jumlah Seluruh Anak", value: anggotaData.family.jumlaSeluruhAnak },
      { label: "Jumlah Anak yang Menjadi Pemuda", value: anggotaData.family.jumlaAnakPemuda },
      { label: "Jumlah Anak yang Menjadi Pemudi", value: anggotaData.family.jumlaAnakPemudi },
    ],
    Education: [
      { label: "Tingkat Pendidikan", value: anggotaData.education.namaTingkat },
      { label: "Nama Sekolah", value: anggotaData.education.namaSekolah },
      { label: "Jurusan", value: anggotaData.education.jurusan },
      { label: "Tahun Masuk", value: anggotaData.education.tahunMasuk },
      { label: "Tahun Keluar", value: anggotaData.education.tahunKeluar },
      { label: "Jenis Pendidikan", value: anggotaData.education.jenisPendidikan },
    ],
    Work: [
      { label: "Pekerjaan", value: anggotaData.work.namaPekerjaan },
      { label: "Pekerjaan Lainnya", value: anggotaData.work.pekerjaanLainnya },
      { label: "Nama Instansi", value: anggotaData.work.namaInstansi },
      { label: "Deskripsi Pekerjaan", value: anggotaData.work.deskripsiPekerjaan },
      { label: "Pendapatan", value: anggotaData.work.pendapatan },
    ],
    Skill: [
      { label: "Keterampilan", value: anggotaData.skill.namaKeterampilan },
      { label: "Keterampilan Lainnya", value: anggotaData.skill.keterampilanLainnya },
      { label: "Deskripsi Keterampilan", value: anggotaData.skill.deskripsiKeterampilan },
    ],
    Interest: anggotaData.interest.map((interest, index) => ({
      label: `Minat ${index + 1}`,
      value: interest.minat === "Lainnya" ? interest.minatLainnya : interest.minat,
    })),    
    Organization: [
      { label: "Keterlibatan Organisasi", value: anggotaData.organization.keterlibatanOrganisasi },
      { label: "Nama Organisasi", value: anggotaData.organization.namaOrganisasi },
    ],
  };

  const tabLabels = {
    Personal: "Data Pribadi",
    Family: "Keluarga",
    Education: "Pendidikan",
    Work: "Pekerjaan",
    Skill: "Keterampilan",
    Interest: "Minat",
    Organization: "Organisasi",
  };

  return (
    <div className="flex justify-center">
      
      <div className="w-full p-6 border rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">View Anggota</h2>
            <a href="/users/data-anggota">
            <button className="p-4 bg-gray-600 text-white py-2 rounded-md">Kembali</button>
            </a>
        </div>

        <div className="border-b pb-2 mb-4 flex space-x-4">
          {Object.keys(tabData).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-semibold ${activeTab === tab ? "border-b-2 border-blue-500" : "text-gray-500"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-2">
            <img src={photo} alt="Profile" className="w-32 h-32 border" />
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {tabData[activeTab].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <label className="text-sm font-medium w-1/3">{item.label}:</label>
                <p className="w-2/3 p-2 border rounded-md">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAnggota;
