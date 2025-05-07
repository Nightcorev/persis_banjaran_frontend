import React, { useState } from "react";
import { toast } from "react-toastify";
import { Upload, Loader2, Download, X } from "lucide-react";
import * as XLSX from "xlsx";

const ImportModal = ({ isOpen, onClose, onImport, loading }) => {
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
      await onImport(file); // Kirim file ke parent
      // onClose(); // Biarkan parent yang menutup setelah sukses API call
    } catch (error) {
      // Error sudah ditangani di parent onImport
      // Tidak perlu toast error lagi di sini agar tidak duplikat
    } finally {
      // Jangan reset file di sini agar user bisa lihat file yg diupload jika ada error
      // setFile(null);
    }
  };

  const downloadFormat = () => {
    const exampleData = [
      {
        "NIK/Nomor KTP (Wajib)": "1234567890123451",
        "Nama Anggota (Opsional)": "Budi Santoso",
        "Bulan Dibayar (Angka dipisah koma, Wajib)": "1,2,3",
        "Tahun (Wajib)": new Date().getFullYear(),
        "Tanggal Bayar (Opsional: YYYY-MM-DD)": "2025-05-05",
        "Nominal Total (Opsional)": 30000,
      },
      {
        "NIK/Nomor KTP (Wajib)": "1234567890123453",
        "Nama Anggota (Opsional)": "Citra Lestari",
        "Bulan Dibayar (Angka dipisah koma, Wajib)": "4",
        "Tahun (Wajib)": new Date().getFullYear(),
        "Tanggal Bayar (Opsional: YYYY-MM-DD)": "",
        "Nominal Total (Opsional)": "",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(exampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Format Import Iuran");
    XLSX.writeFile(wb, "format_import_iuran.xlsx");
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
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Unggah file Excel (.xlsx) sesuai format.
            <button
              onClick={downloadFormat}
              className="ml-2 text-blue-600 hover:underline text-xs inline-flex items-center gap-1"
            >
              <Download size={12} /> Unduh Format
            </button>
          </p>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx, .xls" // Tambah .xls
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            disabled={loading}
          />
          {file && (
            <p className="text-xs text-gray-500">File terpilih: {file.name}</p>
          )}
        </div>
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleImportClick}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm flex items-center disabled:opacity-50"
            disabled={!file || loading}
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
