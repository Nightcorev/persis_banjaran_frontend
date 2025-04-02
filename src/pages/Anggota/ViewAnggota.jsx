import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ViewAnggota = () => {
    const { id } = useParams();
  const [photo] = useState("/default-avatar.png");  // You can modify this if you have a photo URL in the response
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
      { label: "Nama Lengkap", value: anggotaData.personal.namaLengkap },
      { label: "Tempat Lahir", value: anggotaData.personal.tempatLahir },
      { label: "Tanggal Lahir", value: anggotaData.personal.tanggalLahir },
      { label: "Status Pernikahan", value: anggotaData.personal.statusMerital },
      { label: "Nomor Telepon", value: anggotaData.personal.nomorTelepon },
      { label: "Alamat", value: anggotaData.personal.alamat },
    ],
    Family: [
      { label: "Jumlah Tanggungan", value: anggotaData.family.jumlahTanggungan },
      { label: "Nama Istri", value: anggotaData.family.namaIstri },
      { label: "Jumlah Anak", value: anggotaData.family.jumlaSeluruhAnak },
    ],
    Education: [
      { label: "Tingkat Pendidikan", value: anggotaData.education.tingkat },
      { label: "Nama Sekolah", value: anggotaData.education.namaSekolah },
      { label: "Jurusan", value: anggotaData.education.jurusan },
      { label: "Tahun Masuk", value: anggotaData.education.tahunMasuk },
      { label: "Tahun Keluar", value: anggotaData.education.tahunKeluar },
      { label: "Jenis Pendidikan", value: anggotaData.education.jenisPendidikan },
    ],
    Work: [
      { label: "Pekerjaan", value: anggotaData.work.pekerjaan },
      { label: "Nama Instansi", value: anggotaData.work.namaInstansi },
      { label: "Deskripsi Pekerjaan", value: anggotaData.work.deskripsiPekerjaan },
      { label: "Pendapatan", value: anggotaData.work.pendapatan },
    ],
    Skill: [
      { label: "Keterampilan", value: anggotaData.skill.keterampilan },
      { label: "Deskripsi Keterampilan", value: anggotaData.skill.deskripsiKeterampilan },
    ],
    Interest: anggotaData.interest.map((interest, index) => ({
      label: `Minat ${index + 1}`,
      value: interest.minatLainnya || `Minat ID: ${interest.minat}`,
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
            <img src={photo} alt="Profile" className="w-32 h-32 rounded-full border" />
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
