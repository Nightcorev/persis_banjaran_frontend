import React, { useState } from "react";
import { toast } from "react-toastify";
import { Upload, Loader2, Download, X } from "lucide-react";
import * as XLSX from "xlsx"; // Untuk membuat format Excel generik

// Terima props baru: isPjUser, pjJamaahInfo, onDownloadPjTemplate, loadingTemplatePj
const ImportModal = ({
  isOpen,
  onClose,
  onImport,
  loading, // Loading untuk proses impor utama
  isPjUser,
  pjJamaahInfo, // Berisi { id, nama, tahun } untuk PJ
  onDownloadPjTemplate, // Fungsi callback untuk download template PJ
  loadingTemplatePj, // State loading untuk download template PJ
}) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImportClick = async () => {
    if (!file) {
      toast.warn("Pilih file Excel terlebih dahulu.");
      return;
    }
    try {
      await onImport(file); // Kirim file ke parent (KelolaIuran.jsx)
      // onClose(); // Biarkan parent yang menutup modal setelah sukses API call
    } catch (error) {
      // Error sudah ditangani di parent onImport
      // Tidak perlu toast error lagi di sini agar tidak duplikat
    } finally {
      // Jangan reset file di sini agar user bisa lihat file yg diupload jika ada error
      // setFile(null);
    }
  };

  // Fungsi untuk mengunduh format/template
  const handleDownloadFormat = () => {
    if (
      isPjUser &&
      pjJamaahInfo?.id &&
      pjJamaahInfo?.tahun &&
      onDownloadPjTemplate
    ) {
      // Jika PJ dan info lengkap, panggil fungsi download template spesifik PJ dari parent
      onDownloadPjTemplate();
    } else {
      // Jika bukan PJ atau info tidak lengkap, download format generik
      const exampleData = [
        // Kolom ID Anggota sekarang di-hide dan diisi otomatis oleh backend saat download template PJ
        // Untuk format umum, kita bisa beri contoh atau biarkan kosong
        {
          "ID Anggota ": "1",
          "Nama Anggota": "Budi Santoso",
          "Bulan Dibayar (Angka dipisah koma)": "1,2,3",
          "Tahun (Wajib)": pjJamaahInfo?.tahun || new Date().getFullYear(),
          "Tanggal Bayar (Opsional: YYYY-MM-DD)": "2025-05-05",
          "Nominal Total (Opsional)": 30000,
        },
        {
          "ID Anggota ": "2",
          "Nama Anggota": "Citra Lestari",
          "Bulan Dibayar (Angka dipisah koma)": "4",
          "Tahun (Wajib)": pjJamaahInfo?.tahun || new Date().getFullYear(),
          "Tanggal Bayar (Opsional: YYYY-MM-DD)": "",
          "Nominal Total (Opsional)": "",
        },
      ];
      const ws = XLSX.utils.json_to_sheet(exampleData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Format Import Iuran");
      // Atur agar kolom ID Anggota (Hidden) benar-benar tersembunyi jika di-generate di frontend
      // Ini lebih efektif jika dilakukan di backend saat generate file sebenarnya
      // if (ws["!cols"]) {
      //   ws["!cols"][0] = { hidden: true };
      // } else {
      //   ws["!cols"] = [{ hidden: true }];
      // }
      XLSX.writeFile(wb, "format_import_iuran_umum.xlsx");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Impor Data Pembayaran
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
            disabled={loading || loadingTemplatePj}
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Unggah file Excel (.xlsx) sesuai format.
            <button
              onClick={handleDownloadFormat}
              className="ml-2 text-blue-600 hover:underline text-xs inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                loadingTemplatePj ||
                (isPjUser && (!pjJamaahInfo?.id || !pjJamaahInfo?.tahun))
              }
              title={
                isPjUser && (!pjJamaahInfo?.id || !pjJamaahInfo?.tahun)
                  ? "Informasi Jamaah atau Tahun belum lengkap untuk template PJ"
                  : isPjUser
                  ? `Unduh template untuk Jamaah ${pjJamaahInfo?.nama || ""}`
                  : "Unduh format umum"
              }
            >
              {loadingTemplatePj ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Download size={12} />
              )}
              {isPjUser && pjJamaahInfo?.nama
                ? `Unduh Template Jamaah ${pjJamaahInfo.nama}`
                : "Unduh Format Umum"}
            </button>
          </p>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx, .xls" // Izinkan kedua ekstensi
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            disabled={loading || loadingTemplatePj}
          />
          {file && (
            <p className="text-xs text-gray-500">File terpilih: {file.name}</p>
          )}
        </div>
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
            disabled={loading || loadingTemplatePj}
          >
            Batal
          </button>
          <button
            onClick={handleImportClick}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm flex items-center disabled:opacity-50"
            disabled={!file || loading || loadingTemplatePj}
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <Upload size={16} className="mr-2" />
            )}
            {loading ? "Mengimpor..." : "Impor Data"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
