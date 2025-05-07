import React, { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

const ManageTahunModal = ({
  isOpen,
  onClose,
  tahunList,
  onAddTahun,
  onToggleStatus,
  loading,
}) => {
  const [newYear, setNewYear] = useState("");

  const handleAdd = () => {
    if (newYear && /^\d{4}$/.test(newYear)) {
      // Validasi format tahun
      onAddTahun(newYear);
      setNewYear("");
    } else {
      toast.warn("Masukkan format tahun yang valid (YYYY).");
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[80vh]">
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Kelola Tahun Aktif Iuran
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>
        {/* Form Tambah Tahun */}
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            placeholder="YYYY"
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
            min="2020"
            max="2099"
            disabled={loading}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1 disabled:opacity-50"
            disabled={loading || !newYear}
          >
            <Plus size={16} /> Tambah
          </button>
        </div>
        {/* Daftar Tahun */}
        <div className="overflow-y-auto max-h-[calc(80vh-200px)] border border-gray-200 rounded">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Tahun
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="3" className="text-center p-4">
                    <Loader2 className="animate-spin inline-block mr-2" />{" "}
                    Memuat...
                  </td>
                </tr>
              )}
              {!loading && tahunList.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center p-4 text-gray-500 italic"
                  >
                    Belum ada data tahun.
                  </td>
                </tr>
              )}
              {!loading &&
                tahunList.map((th) => (
                  <tr key={th.id}>
                    <td className="px-3 py-2">{th.tahun}</td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          th.status === "Aktif"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {th.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() =>
                          onToggleStatus(
                            th.id,
                            th.status === "Aktif" ? "Tidak Aktif" : "Aktif"
                          )
                        }
                        className={`px-2 py-1 rounded text-white text-xs ${
                          th.status === "Aktif"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-500 hover:bg-green-600"
                        } disabled:opacity-50`}
                        disabled={loading}
                        title={
                          th.status === "Aktif"
                            ? "Jadikan Tidak Aktif"
                            : "Jadikan Aktif"
                        }
                      >
                        {loading ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : th.status === "Aktif" ? (
                          "Nonaktifkan"
                        ) : (
                          "Aktifkan"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm"
            disabled={loading}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageTahunModal;
