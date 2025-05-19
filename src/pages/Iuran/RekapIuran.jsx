import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api"; // Sesuaikan path jika utils ada di level berbeda
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import {
  Download,
  Eye,
  CalendarDays,
  Loader2,
  ListFilter,
  ServerCrash,
  Send,
  Settings,
} from "lucide-react"; // Tambah ServerCrash
import * as XLSX from "xlsx"; // Untuk export rekap ke Excel di frontend

import ManageTahunModal from "../../components/KelolaIuran/ManageTahunModal";

const API_URL = import.meta.env.VITE_API_BASE_URL; // Pastikan VITE_API_BASE_URL sudah ada di .env
const MONTHLY_FEE = 10000;

// --- Helper ---
const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);

// --- Komponen Utama Halaman ---
const RekapIuran = () => {
  // --- State ---
  const [rekapData, setRekapData] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState(null);
  const [tahunOptions, setTahunOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTahun, setLoadingTahun] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(null); // Menyimpan ID jamaah yg sedang di-load templatenya
  const [error, setError] = useState("");

  const [grandTotalSudahDibayar, setGrandTotalSudahDibayar] = useState(0);
  const [grandTotalBelumDibayar, setGrandTotalBelumDibayar] = useState(0);

  const [tahunListManage, setTahunListManage] = useState(false);
  const [isManageTahunModalOpen, setIsManageTahunModalOpen] = useState(false);

  const account = JSON.parse(localStorage.getItem("user"));
  const isBendaharaOrAdmin = ["Bendahara", "Super Admin"].includes(
    account?.role
  );
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
  // Helper function
  const hasPermission = (perm) =>
    isBendaharaOrAdmin ||
    (Array.isArray(permissions) && permissions.includes(perm));

  const navigate = useNavigate();

  const fetchTahunAktif = useCallback(async () => {
    setLoadingTahun(true);
    try {
      const response = await api.get("/tahun-aktif"); // Panggil GET /api/tahun-aktif
      const options = (response.data || []).map((th) => ({
        value: th.tahun,
        label: th.tahun.toString(),
      }));
      setTahunOptions(options);
      setTahunListManage(response.data); // Simpan data tahun untuk kelola tahun
      if (!selectedTahun && options.length > 0) {
        const tahunAktifDefault = response.data.find(
          (th) => th.status === "Aktif"
        );
        setSelectedTahun(
          tahunAktifDefault
            ? {
                value: tahunAktifDefault.tahun,
                label: tahunAktifDefault.tahun.toString(),
              }
            : options[0]
        );
      } else if (
        options.length > 0 &&
        !options.find((opt) => opt.value === selectedTahun?.value)
      ) {
        // Jika tahun yg dipilih sebelumnya tidak ada lagi, pilih yg pertama
        setSelectedTahun(options[0]);
      } else if (options.length === 0) {
        setSelectedTahun(null); // Tidak ada tahun, kosongkan pilihan
      }
    } catch (err) {
      toast.error("Gagal memuat data tahun.");
      console.error("Fetch Tahun Error:", err);
    } finally {
      setLoadingTahun(false);
    }
  }, []); // selectedTahun dihapus dari dependency agar tidak re-fetch terus saat dipilih

  const fetchRekapData = useCallback(async () => {
    if (!selectedTahun?.value) {
      // Pastikan ada value tahun yg dipilih
      setRekapData([]); // Kosongkan data jika tidak ada tahun
      setGrandTotalSudahDibayar(0);
      setGrandTotalBelumDibayar(0);
      return;
    }
    setLoading(true);
    setError(null);
    console.log("Fetching rekap data untuk tahun:", selectedTahun.value);
    try {
      const response = await api.get(`/iuran/rekap-jamaah`, {
        params: { tahun: selectedTahun.value },
      });
      console.log("DATA REKAP DITERIMA DARI API:", response.data);
      setRekapData(response.data || []);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal memuat data rekap iuran.";
      setError(errorMessage);
      // toast.error(errorMessage); // Mungkin terlalu banyak toast
      console.error("Fetch Rekap Error:", err);
      setRekapData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedTahun]);

  // Fetch data awal
  useEffect(() => {
    fetchTahunAktif();
  }, [fetchTahunAktif]);

  useEffect(() => {
    if (selectedTahun) {
      fetchRekapData();
    }
  }, [fetchRekapData, selectedTahun]);

  // --- Kalkulasi Grand Total ---
  useEffect(() => {
    let totalSudah = 0;
    let totalBelum = 0;
    rekapData.forEach((item) => {
      totalSudah += Number(item.total_sudah_dibayar) || 0;
      totalBelum += Number(item.total_belum_dibayar) || 0;
    });
    setGrandTotalSudahDibayar(totalSudah);
    setGrandTotalBelumDibayar(totalBelum);
  }, [rekapData]);

  // --- Handlers ---
  const handleDownloadTemplate = async (jamaahId, namaJamaah) => {
    if (!selectedTahun?.value) {
      toast.warn("Pilih tahun terlebih dahulu.");
      return;
    }
    setLoadingTemplate(jamaahId); // Set loading untuk tombol spesifik ini
    toast.info(`Mempersiapkan template untuk ${namaJamaah}...`);
    try {
      const response = await api.get(`/iuran/template-pembayaran/${jamaahId}`, {
        params: { tahun: selectedTahun.value },
        responseType: "blob", // Penting untuk download file
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = `template_pembayaran_${namaJamaah.replace(
        /\s+/g,
        "_"
      )}_${selectedTahun.value}.xlsx`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`Template untuk ${namaJamaah} berhasil diunduh.`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Gagal mengunduh template untuk ${namaJamaah}.`
      );
      console.error("Download template error:", error);
    } finally {
      setLoadingTemplate(null);
    }
  };

  const handleLihatDetail = (jamaahId) => {
    if (!selectedTahun?.value) {
      toast.warn("Pilih tahun terlebih dahulu untuk melihat detail.");
      return;
    }
    // Navigasi ke halaman KelolaIuran dengan parameter
    navigate(
      `/iuran/pembayaran?jamaah_id=${jamaahId}&tahun=${selectedTahun.value}`
    );
  };

  const handleExportRekap = async () => {
    if (rekapData.length === 0) {
      toast.warn("Tidak ada data untuk diekspor.");
      return;
    }
    if (!selectedTahun?.value) {
      toast.warn("Pilih tahun terlebih dahulu.");
      return;
    }
    setLoadingExport(true);
    toast.info("Mempersiapkan data rekap untuk diunduh...");

    try {
      // Panggil API backend untuk export
      const response = await api.get(`/iuran/rekap-jamaah/export`, {
        params: { tahun: selectedTahun.value },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = `Rekap_Iuran_Jamaah_Tahun_${selectedTahun.value}.xlsx`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("File rekap berhasil diunduh.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengekspor rekap.");
      console.error("Export rekap error:", error);
    } finally {
      setLoadingExport(false);
    }
  };

  const handleAddTahun = async (tahun) => {
    setLoadingTahun(true);
    try {
      await api.post("/tahun-aktif", { tahun });
      toast.success(`Tahun ${tahun} berhasil ditambahkan.`);
      fetchTahunAktif();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menambah tahun.");
    } finally {
      setLoadingTahun(false);
    }
  };

  const handleToggleTahunStatus = async (id, newStatus) => {
    if (newStatus === "Aktif") {
      const tahunAktifLain = tahunListManage.find(
        (th) => th.id !== id && th.status === "Aktif"
      );
      if (
        tahunAktifLain &&
        !window.confirm(
          `Tahun ${tahunAktifLain.tahun} sedang aktif. Apakah Anda yakin ingin mengaktifkan tahun ini? Tahun ${tahunAktifLain.tahun} akan otomatis tidak aktif.`
        )
      ) {
        return;
      }
    }
    setLoadingTahun(true);
    try {
      await api.put(`/tahun-aktif/${id}`, { status: newStatus });
      toast.success(`Status tahun berhasil diubah.`);
      await fetchTahunAktif(); // Tunggu fetchTahunAktif selesai
      // Jika tahun yang diubah adalah tahun yang sedang difilter, refresh iuran
      // Cek apakah selectedTahun perlu diupdate jika tahun aktif berubah
      const updatedTahun = tahunListManage.find((th) => th.id === id);
      if (
        updatedTahun &&
        selectedTahun &&
        updatedTahun.tahun === selectedTahun.value
      ) {
        // Jika tahun yang statusnya diubah adalah tahun yang dipilih,
        // dan status barunya 'Tidak Aktif', mungkin reset filter tahun atau pilih yg aktif baru
        if (newStatus === "Tidak Aktif") {
          const tahunAktifBaru = tahunOptions.find(
            (th) =>
              th.value !== selectedTahun.value &&
              tahunListManage.find(
                (tl) => tl.tahun === th.value && tl.status === "Aktif"
              )
          );
          setSelectedTahun(
            tahunAktifBaru || (tahunOptions.length > 0 ? tahunOptions[0] : null)
          );
        }
      } else if (newStatus === "Aktif") {
        // Jika tahun lain diaktifkan
        setSelectedTahun({
          value: updatedTahun.tahun,
          label: updatedTahun.tahun.toString(),
        });
      }
      // fetchIuranSummary(); // Akan ter-trigger oleh perubahan selectedTahun
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Gagal mengubah status tahun."
      );
    } finally {
      setLoadingTahun(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div
        className="max-w-7xl mx-auto bg-white p-5 sm:p-6 rounded-lg shadow-md flex flex-col"
        style={{ height: "calc(100vh - 2rem)" }}
      >
        {/* Header Halaman */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b gap-4 flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0 text-center md:text-left w-full md:w-auto">
            Rekap Iuran per Jamaah
          </h1>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 justify-center md:justify-end w-full md:w-auto">
            <div className="w-full sm:w-48">
              <label htmlFor="tahunFilterRekap" className="sr-only">
                Filter Tahun
              </label>
              <Select
                id="tahunFilterRekap"
                options={tahunOptions}
                value={selectedTahun}
                onChange={setSelectedTahun}
                placeholder="Pilih Tahun..."
                isLoading={loadingTahun}
                isDisabled={loading || loadingTahun}
                className="text-sm z-20"
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={document.body}
              />
            </div>
            {hasPermission("send_reminder_iuran") && (
              <Link to="/iuran/reminder" className="w-full sm:w-auto">
                <button className="flex items-center justify-center w-full gap-1 px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm shadow-sm">
                  <Send size={16} /> Kirim Reminder Iuran
                </button>
              </Link>
            )}
            {hasPermission("show_kelola_tahun_iuran") && (
              <button
                onClick={() => setIsManageTahunModalOpen(true)}
                className="flex items-center justify-center w-full gap-1 px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 text-sm shadow-sm disabled:opacity-50"
                disabled={loading || loadingTahun}
              >
                <Settings size={16} /> Kelola Tahun Iuran
              </button>
            )}
            {hasPermission("export_rekap_iuran") && (
              <button
                onClick={handleExportRekap}
                className="flex items-center justify-center w-full gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm shadow-sm disabled:opacity-50"
                disabled={loading || loadingExport || rekapData.length === 0}
              >
                {loadingExport ? (
                  <Loader2 size={16} className="animate-spin mr-1" />
                ) : (
                  <Download size={16} />
                )}
                Export Rekap
              </button>
            )}
          </div>
        </div>

        {/* Alert Error */}
        {error && !loading && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300 text-sm flex-shrink-0 flex flex-col sm:flex-row items-center gap-2 w-full">
            <div className="flex items-center gap-2">
              <ServerCrash size={18} /> {error}
            </div>
            <button
              onClick={fetchRekapData}
              className="ml-0 sm:ml-auto font-semibold underline hover:text-red-900 mt-2 sm:mt-0"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Tabel Data dengan Scroll */}
        <div className="flex-grow overflow-auto border border-gray-200 rounded-lg relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          )}
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="px-2 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider w-8 md:w-10"
                  >
                    No
                  </th>
                  <th
                    scope="col"
                    className="px-2 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] md:min-w-[180px]"
                  >
                    Nama Jamaah
                  </th>
                  <th
                    scope="col"
                    className="px-2 md:px-4 py-2 md:py-3 text-right text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] md:min-w-[120px]"
                  >
                    Sudah Dibayar
                  </th>
                  <th
                    scope="col"
                    className="px-2 md:px-4 py-2 md:py-3 text-right text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] md:min-w-[120px]"
                  >
                    Belum Dibayar
                  </th>
                  <th
                    scope="col"
                    className="px-2 md:px-4 py-2 md:py-3 text-center text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] md:min-w-[90px]"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!loading && rekapData.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center p-5 text-gray-500 italic"
                    >
                      {selectedTahun
                        ? "Tidak ada data rekap untuk tahun ini."
                        : "Pilih tahun untuk melihat rekap."}
                    </td>
                  </tr>
                )}
                {!loading &&
                  rekapData.map((item, index) => (
                    <tr key={item.id_jamaah} className="hover:bg-gray-50">
                      <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-center text-gray-500 text-xs md:text-sm">
                        {index + 1}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap font-medium text-gray-900 text-xs md:text-sm break-words">
                        {item.nama_jamaah}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-right text-green-600 text-xs md:text-sm">
                        {formatRupiah(item.total_sudah_dibayar)}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-right text-red-600 text-xs md:text-sm">
                        {formatRupiah(item.total_belum_dibayar)}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-center">
                        <div className="flex justify-center items-center gap-1 md:gap-2">
                          {hasPermission("import_rekap_iuran") && (
                            <button
                              onClick={() =>
                                handleDownloadTemplate(
                                  item.id_jamaah,
                                  item.nama_jamaah
                                )
                              }
                              className="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                              title="Unduh Template Excel Pembayaran Jamaah Ini"
                              disabled={loadingTemplate === item.id_jamaah}
                            >
                              {loadingTemplate === item.id_jamaah ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Download size={14} />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleLihatDetail(
                                item.id_jamaah,
                                selectedTahun?.value
                              )
                            }
                            className="p-1 text-indigo-600 hover:text-indigo-800"
                            title="Lihat Detail Pembayaran Anggota Jamaah Ini"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
              {/* Footer Tabel untuk Grand Total */}
              {!loading && rekapData.length > 0 && (
                <tfoot className="bg-gray-100 font-semibold sticky bottom-0 z-10">
                  <tr>
                    <td
                      colSpan="2"
                      className="px-2 md:px-4 py-2 md:py-3 text-right text-gray-700 uppercase text-xs md:text-sm"
                    >
                      Total Keseluruhan:
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-right text-green-700 text-xs md:text-sm">
                      {formatRupiah(grandTotalSudahDibayar)}
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-right text-red-700 text-xs md:text-sm">
                      {formatRupiah(grandTotalBelumDibayar)}
                    </td>
                    <td colSpan="2" className="px-2 md:px-4 py-2 md:py-3"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
      <ManageTahunModal
        isOpen={isManageTahunModalOpen}
        onClose={() => setIsManageTahunModalOpen(false)}
        tahunList={tahunListManage}
        onAddTahun={handleAddTahun}
        onToggleStatus={handleToggleTahunStatus}
        loading={loadingTahun}
      />
    </div>
  );
};

export default RekapIuran;
