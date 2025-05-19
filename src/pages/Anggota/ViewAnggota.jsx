import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api"; // Import the API utility

const ViewAnggota = () => {
  const { id } = useParams();
  const [photo, setPhoto] = useState("");
  const [activeTab, setActiveTab] = useState("Personal");
  const [anggotaData, setAnggotaData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchAnggotaData = async () => {
      try {
        const response = await api.get(`/get_anggota/${id}`);
        setAnggotaData(response.data);
        setPhoto(response.data.personal.fotoURL);
      } catch (error) {
        console.error("Error fetching anggota data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnggotaData();
  }, [id]);

  if (loading || !anggotaData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500"></div>
        <span className="ml-3 text-gray-600">Memuat data...</span>
      </div>
    );
  }

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
      { label: "Status Kepemilikan Rumah", value: anggotaData.family.statusKepemilikanRumah },
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
    <div className="w-full bg-gray-50 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Detail Anggota
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
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-full px-2 overflow-x-auto scrollbar-hide">
          <ul className="flex w-max space-x-2 py-3 px-2">
            {Object.keys(tabData).map((tab) => (
              <li 
                key={tab} 
                className={`cursor-pointer px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap
                  ${activeTab === tab 
                    ? "bg-green-700 text-white font-medium shadow-md" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"}
                `} 
                onClick={() => setActiveTab(tab)}
              >
                {tabLabels[tab]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side - Photo Area (optimized) */}
          <div className="w-full md:w-72 lg:w-80">
            <div className="bg-white rounded-xl overflow-hidden shadow-md sticky top-20">
              <div className="p-3 border-b bg-gray-50">
                <h3 className="font-medium text-gray-800 text-center">Foto Anggota</h3>
              </div>
              <div className="p-4">
                <div className="relative rounded-lg overflow-hidden aspect-square bg-gray-100 shadow-inner">
                  {photo ? (
                    <img 
                      src={photo}
                      alt={anggotaData.personal.namaLengkap || "Foto Anggota"} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <span className="mt-2 text-sm text-gray-400">Tidak ada foto</span>
                    </div>
                  )}
                </div>
                
                {/* Name card below photo */}
                {anggotaData.personal.namaLengkap && (
                  <div className="mt-4 py-2 px-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                    <h4 className="font-medium text-gray-800 text-base">
                      {anggotaData.personal.namaLengkap}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {anggotaData.personal.nomorAnggota ? (
                        <>No. Anggota: {anggotaData.personal.nomorAnggota}</>
                      ) : (
                        "Anggota Persis"
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Data Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="p-3 border-b bg-gray-50">
                <h3 className="font-medium text-gray-800">{tabLabels[activeTab]}</h3>
              </div>
              <div className="p-5">
                {/* Better layout for data fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {tabData[activeTab].map((item) => (
                    <div key={item.label} className="group">
                      <label className="text-xs font-medium text-gray-500 block mb-1">
                        {item.label}
                      </label>
                      <div className="w-full bg-gray-50 border rounded-md transition-colors group-hover:border-green-300">
                        <p className="text-sm py-2.5 px-3 overflow-hidden text-ellipsis">
                          {item.value || "-"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Special case for Interest data which can have multiple entries */}
                {activeTab === "Interest" && tabData[activeTab].length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    Tidak ada data minat yang tercatat
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAnggota;
