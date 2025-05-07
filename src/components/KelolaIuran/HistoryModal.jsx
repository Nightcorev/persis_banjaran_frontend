import React, { useState } from "react"; // Hapus useState jika tidak dipakai di sini
import { Loader2, CircleCheck, CircleX, Clock, X } from "lucide-react";
import { toast } from "react-toastify";

// Helper (bisa dipindah ke file utils terpisah jika dipakai di banyak tempat)
const MONTH_NAMES_HISTORY = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Ags",
  "Sep",
  "Okt",
  "Nov",
  "Des",
]; // Hindari konflik nama
const formatRupiahHistory = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);
const formatDateTimeHistory = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch (error) {
    return "Invalid Date";
  }
};

const HistoryModal = ({
  isOpen,
  onClose,
  historyData,
  loading,
  target,
  onVerify,
  onReject,
}) => {
  const [rejectNote, setRejectNote] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // ID log yg sedang diproses

  // Ambil role user (ganti dengan cara Anda)
  const account = JSON.parse(localStorage.getItem("user")) || {
    role: "Bendahara",
  };
  const canVerify = ["Bendahara", "Super Admin"].includes(account?.role);

  const handleVerifyClick = async (logId) => {
    setActionLoading(logId);
    try {
      await onVerify(logId);
    } catch (error) {
      // Error toast sudah di parent
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectAttempt = (logId) => {
    if (rejectingId === logId) {
      if (rejectNote.trim()) {
        handleRejectConfirm(logId);
      } else {
        toast.warn("Masukkan alasan penolakan.");
      }
    } else {
      setRejectingId(logId);
      setRejectNote("");
    }
  };

  const handleRejectConfirm = async (logId) => {
    setActionLoading(logId);
    try {
      await onReject(logId, rejectNote);
      setRejectingId(null);
      setRejectNote("");
    } catch (error) {
      // Error toast sudah di parent
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelReject = () => {
    setRejectingId(null);
    setRejectNote("");
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded border border-green-400">
            Verified
          </span>
        );
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded border border-yellow-300">
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded border border-red-400">
            Failed
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded border border-gray-500">
            N/A
          </span>
        );
    }
  };

  const formatPaidMonths = (monthsArray) => {
    if (!monthsArray || monthsArray.length === 0) return "-";
    try {
      const parsedMonths =
        typeof monthsArray === "string" ? JSON.parse(monthsArray) : monthsArray;
      if (!Array.isArray(parsedMonths)) return "-";
      return parsedMonths
        .map((monthNum) => MONTH_NAMES_HISTORY[monthNum - 1] || "?")
        .join(", ");
    } catch (e) {
      console.error("Error parsing paid months:", e);
      return "Error";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 max-h-[80vh]">
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Riwayat Pembayaran - {target?.nama || ""} ({target?.tahun || ""})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
          {loading && (
            <div className="text-center p-5">
              <Loader2 className="animate-spin inline-block mr-2" /> Memuat
              riwayat...
            </div>
          )}
          {!loading && historyData.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Tidak ada riwayat pembayaran lunas atau gagal.
            </p>
          )}
          {!loading && historyData.length > 0 && (
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Tgl. Transaksi
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Bulan Dibayar
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">
                    Nominal
                  </th>
                  <th className="px-3 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Verifikator
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Catatan Verifikasi
                  </th>
                  {/* Aksi hanya ada di Modal Validasi, jadi kolom ini bisa dihilangkan dari History jika tidak ada aksi lain */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historyData.map((log) => (
                  <tr key={log.id}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {formatDateTimeHistory(log.tanggal || log.created_at)}
                    </td>
                    <td className="px-3 py-2">
                      {formatPaidMonths(log.paid_months)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right">
                      {formatRupiahHistory(log.nominal)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-center">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {log.verifikator?.name ||
                        (log.status === "Verified" &&
                        log.pj_input_id !== log.verifikator_id
                          ? "Otomatis"
                          : "-")}
                    </td>
                    <td className="px-3 py-2">
                      {log.catatan_verifikasi || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
