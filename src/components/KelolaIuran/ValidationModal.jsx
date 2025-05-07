import React, { useState } from "react";
import { Loader2, CircleCheck, CircleX, X } from "lucide-react";
import { toast } from "react-toastify";

// Helper (bisa dipindah ke file utils terpisah)
const MONTH_NAMES_VALIDATION = [
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
];
const formatRupiahValidation = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);
const formatDateTimeValidation = (isoString) => {
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

const ValidationModal = ({
  isOpen,
  onClose,
  pendingLogs,
  loading,
  target,
  onVerify,
  onReject,
}) => {
  const [rejectNote, setRejectNote] = useState("");
  const [rejectingId, setRejectingId] = useState(null); // ID log yg sedang direject
  const [actionLoading, setActionLoading] = useState(null); // ID log yg sedang diproses (verify/reject)

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

  const formatPaidMonths = (monthsArray) => {
    if (!monthsArray || monthsArray.length === 0) return "-";
    try {
      const parsedMonths =
        typeof monthsArray === "string" ? JSON.parse(monthsArray) : monthsArray;
      if (!Array.isArray(parsedMonths)) return "-";
      return parsedMonths
        .map((monthNum) => MONTH_NAMES_VALIDATION[monthNum - 1] || "?")
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
        {" "}
        {/* Lebarkan modal */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Validasi Pembayaran Pending - {target?.nama || ""} (
            {target?.tahun || ""})
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
              <Loader2 className="animate-spin inline-block mr-2" /> Memuat data
              pending...
            </div>
          )}
          {!loading && pendingLogs.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Tidak ada pembayaran pending untuk divalidasi.
            </p>
          )}
          {!loading && pendingLogs.length > 0 && (
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Tgl. Input
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Bulan Dibayar
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">
                    Nominal
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Diinput Oleh
                  </th>
                  <th className="px-3 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {formatDateTimeValidation(log.created_at)}
                      </td>{" "}
                      {/* Gunakan created_at untuk tgl input */}
                      <td className="px-3 py-2">
                        {formatPaidMonths(log.paid_months)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        {formatRupiahValidation(log.nominal)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {log.pj_input?.name || "N/A"}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleVerifyClick(log.id)}
                            className="p-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                            title="Verifikasi Pembayaran Ini"
                            disabled={actionLoading === log.id}
                          >
                            {actionLoading === log.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <CircleCheck size={12} />
                            )}
                          </button>
                          <button
                            onClick={() => handleRejectAttempt(log.id)}
                            className={`p-1 rounded text-white ${
                              rejectingId === log.id
                                ? "bg-red-700"
                                : "bg-red-500 hover:bg-red-600"
                            } disabled:opacity-50`}
                            title="Tolak Pembayaran Ini"
                            disabled={actionLoading === log.id}
                          >
                            {actionLoading === log.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <CircleX size={12} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Input Catatan Reject */}
                    {rejectingId === log.id && (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-2 bg-red-50 border-t border-red-200"
                        >
                          <div className="flex items-center gap-2">
                            <textarea
                              value={rejectNote}
                              onChange={(e) => setRejectNote(e.target.value)}
                              placeholder="Masukkan alasan penolakan..."
                              rows="1"
                              className="w-full border rounded px-2 py-1 text-xs focus:ring-red-500 focus:border-red-500"
                            ></textarea>
                            <button
                              onClick={() => handleRejectConfirm(log.id)}
                              className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
                              disabled={
                                !rejectNote.trim() || actionLoading === log.id
                              }
                            >
                              {actionLoading === log.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                "Tolak"
                              )}
                            </button>
                            <button
                              onClick={handleCancelReject}
                              className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                              disabled={actionLoading === log.id}
                            >
                              Batal
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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

export default ValidationModal;
