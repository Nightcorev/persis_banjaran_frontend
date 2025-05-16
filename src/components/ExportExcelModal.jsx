import React, { useState } from "react";
import api from "../utils/api";

const ExportExcelModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState({
    // Personal Info
    nik: true,
    nomor_ktp: true,
    nama_lengkap: true,
    tempat_lahir: true,
    tanggal_lahir: true,
    status_merital: false,
    no_telp: false,
    no_wa: false,
    alamat: false,
    alamat_tinggal: false,
    nama_otonom: true,
    nama_jamaah: true,
    status_aktif: true,
    tahun_masuk: false,
    masa_aktif: false,
    kajian_rutin: false,
    tahun_haji: false,
    keterangan: false,
    
    // Family
    jumlah_tanggungan: false,
    nama_istri: false,
    anggota_persistri: false,
    status_kepemilikan_rumah: false,
    jumlah_seluruh_anak: false,
    jumlah_anak_pemuda: false,
    jumlah_anak_pemudi: false,
    
    // Education
    tingkat_pendidikan: true,
    nama_sekolah: false,
    jurusan: false,
    tahun_masuk_pendidikan: false,
    tahun_keluar: false,
    jenis_pendidikan: false,
    
    // Work
    nama_pekerjaan: true,
    pekerjaan_lainnya: false,
    nama_instansi: false,
    deskripsi_pekerjaan: false,
    pendapatan: false,
    
    // Skill
    nama_keterampilan: false,
    keterampilan_lainnya: false,
    deskripsi_keterampilan: false,
    
    // Organization
    keterlibatan_organisasi: false,
    nama_organisasi: false,
  });

  const columnGroups = {
    "Data Pribadi": [
      { id: "nik", label: "NIK" },
      { id: "nomor_ktp", label: "Nomor KTP" },
      { id: "nama_lengkap", label: "Nama Lengkap" },
      { id: "tempat_lahir", label: "Tempat Lahir" },
      { id: "tanggal_lahir", label: "Tanggal Lahir" },
      { id: "status_merital", label: "Status Marital" },
      { id: "no_telp", label: "Nomor Telepon" },
      { id: "no_wa", label: "Nomor WhatsApp" },
      { id: "alamat", label: "Alamat" },
      { id: "alamat_tinggal", label: "Alamat Tinggal" },
      { id: "nama_otonom", label: "Otonom" },
      { id: "nama_jamaah", label: "Jamaah" },
      { id: "status_aktif", label: "Status Aktif" },
      { id: "tahun_masuk", label: "Tahun Masuk" },
      { id: "masa_aktif", label: "Masa Aktif" },
      { id: "kajian_rutin", label: "Kajian Rutin" },
      { id: "tahun_haji", label: "Tahun Haji" },
      { id: "keterangan", label: "Keterangan" },
    ],
    "Data Keluarga": [
      { id: "jumlah_tanggungan", label: "Jumlah Tanggungan" },
      { id: "nama_istri", label: "Nama Istri" },
      { id: "anggota_persistri", label: "Anggota Persistri" },
      { id: "status_kepemilikan_rumah", label: "Status Kepemilikan Rumah" },
      { id: "jumlah_seluruh_anak", label: "Jumlah Seluruh Anak" },
      { id: "jumlah_anak_pemuda", label: "Jumlah Anak Pemuda" },
      { id: "jumlah_anak_pemudi", label: "Jumlah Anak Pemudi" },
    ],
    "Data Pendidikan": [
      { id: "tingkat_pendidikan", label: "Tingkat Pendidikan" },
      { id: "nama_sekolah", label: "Nama Sekolah" },
      { id: "jurusan", label: "Jurusan" },
      { id: "tahun_masuk_pendidikan", label: "Tahun Masuk" },
      { id: "tahun_keluar", label: "Tahun Keluar" },
      { id: "jenis_pendidikan", label: "Jenis Pendidikan" },
    ],
    "Data Pekerjaan": [
      { id: "nama_pekerjaan", label: "Pekerjaan" },
      { id: "pekerjaan_lainnya", label: "Pekerjaan Lainnya" },
      { id: "nama_instansi", label: "Nama Instansi" },
      { id: "deskripsi_pekerjaan", label: "Deskripsi Pekerjaan" },
      { id: "pendapatan", label: "Pendapatan" },
    ],
    "Data Keterampilan": [
      { id: "nama_keterampilan", label: "Keterampilan" },
      { id: "keterampilan_lainnya", label: "Keterampilan Lainnya" },
      { id: "deskripsi_keterampilan", label: "Deskripsi Keterampilan" },
    ],
    "Data Organisasi": [
      { id: "keterlibatan_organisasi", label: "Keterlibatan Organisasi" },
      { id: "nama_organisasi", label: "Nama Organisasi" },
    ],
  };

  const handleToggleColumn = (columnId) => {
    setSelectedColumns({
      ...selectedColumns,
      [columnId]: !selectedColumns[columnId],
    });
  };

  const handleSelectAllInGroup = (group, isSelected) => {
    const updatedColumns = { ...selectedColumns };
    columnGroups[group].forEach((column) => {
      updatedColumns[column.id] = isSelected;
    });
    setSelectedColumns(updatedColumns);
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      
      const columnsToExport = Object.keys(selectedColumns).filter(
        (key) => selectedColumns[key]
      );
      
      if (columnsToExport.length === 0) {
        alert("Pilih minimal satu kolom untuk diekspor");
        setLoading(false);
        return;
      }
      
      const response = await api.post(
        "/anggota/export-excel",
        { columns: columnsToExport },
        { responseType: "blob" }
      );
      
      // Create a download link and click it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `data_anggota_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      onClose();
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Terjadi kesalahan saat mengekspor data");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Export Data Anggota ke Excel</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <p className="mb-4 text-sm text-gray-600">
            Pilih kolom yang ingin disertakan dalam file Excel:
          </p>
          
          {Object.keys(columnGroups).map((groupName) => (
            <div key={groupName} className="mb-6">
              <div className="flex items-center mb-2">
                <h3 className="font-medium text-gray-800">{groupName}</h3>
                <div className="ml-4 flex space-x-2">
                  <button
                    onClick={() => handleSelectAllInGroup(groupName, true)}
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Pilih Semua
                  </button>
                  <button
                    onClick={() => handleSelectAllInGroup(groupName, false)}
                    className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                  >
                    Batalkan Semua
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {columnGroups[groupName].map((column) => (
                  <div key={column.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={column.id}
                      checked={selectedColumns[column.id] || false}
                      onChange={() => handleToggleColumn(column.id)}
                      className="mr-2 h-4 w-4 text-green-600"
                    />
                    <label htmlFor={column.id} className="text-sm text-gray-700">
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengekspor...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Excel
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportExcelModal;