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
} from "lucide-react"; // Tambah ServerCrash
import * as XLSX from "xlsx"; // Untuk export rekap ke Excel di frontend

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

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div
        className="max-w-7xl mx-auto bg-white p-5 sm:p-6 rounded-lg shadow-md flex flex-col"
        style={{ height: "calc(100vh - 2rem)" }}
      >
        {/* Header Halaman */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">
            Rekap Iuran per Jamaah
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-48">
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
            <button
              onClick={handleExportRekap}
              className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm shadow-sm disabled:opacity-50"
              disabled={loading || loadingExport || rekapData.length === 0}
            >
              {loadingExport ? (
                <Loader2 size={16} className="animate-spin mr-1" />
              ) : (
                <Download size={16} />
              )}
              Export Rekap
            </button>
          </div>
        </div>

        {/* Alert Error */}
        {error && !loading && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300 text-sm flex-shrink-0 flex items-center gap-2">
            <ServerCrash size={18} /> {error}
            <button
              onClick={fetchRekapData}
              className="ml-auto font-semibold underline hover:text-red-900"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Tabel Data dengan Scroll */}
        <div className="flex-grow overflow-auto border border-gray-200 rounded-lg relative">
          {loading /* Overlay Loading */ && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          )}
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
                >
                  No
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nama Jamaah
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sudah Dibayar
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Belum Dibayar
                </th>

                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                    <td className="px-4 py-3 whitespace-nowrap text-center text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                      {item.nama_jamaah}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-green-600">
                      {formatRupiah(item.total_sudah_dibayar)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-red-600">
                      {formatRupiah(item.total_belum_dibayar)}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() =>
                            handleDownloadTemplate(
                              item.id_jamaah,
                              item.nama_jamaah
                            )
                          }
                          className="p-1.5 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          title="Unduh Template Excel Pembayaran Jamaah Ini"
                          disabled={loadingTemplate === item.id_jamaah}
                        >
                          {loadingTemplate === item.id_jamaah ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Download size={16} />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleLihatDetail(
                              item.id_jamaah,
                              selectedTahun?.value
                            )
                          }
                          className="p-1.5 text-indigo-600 hover:text-indigo-800"
                          title="Lihat Detail Pembayaran Anggota Jamaah Ini"
                        >
                          <Eye size={16} />
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
                    className="px-4 py-3 text-right text-gray-700 uppercase"
                  >
                    Total Keseluruhan:
                  </td>
                  <td className="px-4 py-3 text-right text-green-700">
                    {formatRupiah(grandTotalSudahDibayar)}
                  </td>
                  <td className="px-4 py-3 text-right text-red-700">
                    {formatRupiah(grandTotalBelumDibayar)}
                  </td>
                  <td colSpan="2" className="px-4 py-3"></td>{" "}
                  {/* Kolom kosong untuk Anggota & Action */}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        {/* Pagination tidak diperlukan jika rekap selalu menampilkan semua jamaah */}
      </div>
    </div>
  );
};

export default RekapIuran;
