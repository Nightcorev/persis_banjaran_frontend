import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate untuk tombol detail
import { toast } from "react-toastify";
import api from "../../utils/api"; // Sesuaikan path jika perlu
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import { Download, Eye, CalendarDays, Loader2, ListFilter } from "lucide-react";
import * as XLSX from "xlsx"; // Untuk export rekap ke Excel di frontend

const API_URL = import.meta.env.VITE_API_BASE_URL;
const MONTHLY_FEE = 10000; // Biaya iuran per bulan

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
  const [error, setError] = useState("");

  const [grandTotalSudahDibayar, setGrandTotalSudahDibayar] = useState(0);
  const [grandTotalBelumDibayar, setGrandTotalBelumDibayar] = useState(0);

  const navigate = useNavigate(); // Untuk tombol "Lihat Detail"

  // --- Data Dummy (Ganti dengan API call nanti) ---
  const dummyRekapData = [
    {
      id_jamaah: 1,
      nama_jamaah: "Jamaah Al-Ikhlas",
      total_sudah_dibayar: 1500000,
      total_belum_dibayar: 300000,
      jumlah_anggota: 15,
    },
    {
      id_jamaah: 2,
      nama_jamaah: "Jamaah An-Nur",
      total_sudah_dibayar: 2000000,
      total_belum_dibayar: 400000,
      jumlah_anggota: 20,
    },
    {
      id_jamaah: 3,
      nama_jamaah: "Jamaah Ar-Rahman",
      total_sudah_dibayar: 1200000,
      total_belum_dibayar: 600000,
      jumlah_anggota: 15,
    },
  ];

  const dummyTahunOptions = [
    { value: 2025, label: "2025" },
    { value: 2024, label: "2024" },
  ];

  // --- Fetch Data ---
  const fetchTahunAktif = useCallback(async () => {
    setLoadingTahun(true);
    try {
      // Ganti dengan API call ke backend Anda: GET /api/tahun-aktif
      // const response = await api.get('/tahun-aktif');
      // const options = response.data.map(th => ({ value: th.tahun, label: th.tahun.toString() }));
      // setTahunOptions(options);
      // if (options.length > 0) {
      //     const tahunAktifDefault = response.data.find(th => th.status === 'Aktif');
      //     setSelectedTahun(tahunAktifDefault ? { value: tahunAktifDefault.tahun, label: tahunAktifDefault.tahun.toString() } : options[0]);
      // }
      setTahunOptions(dummyTahunOptions); // Pakai dummy
      if (dummyTahunOptions.length > 0) {
        setSelectedTahun(
          dummyTahunOptions.find(
            (th) => th.value === new Date().getFullYear()
          ) || dummyTahunOptions[0]
        ); // Default ke tahun ini atau pertama
      }
    } catch (err) {
      toast.error("Gagal memuat data tahun.");
      console.error("Fetch Tahun Error:", err);
    } finally {
      setLoadingTahun(false);
    }
  }, []); // selectedTahun dihapus agar tidak re-fetch terus

  const fetchRekapData = useCallback(async () => {
    if (!selectedTahun) return;
    setLoading(true);
    setError(null);
    console.log("Fetching rekap data untuk tahun:", selectedTahun.value);
    try {
      // Ganti dengan API call ke backend Anda: GET /api/iuran/rekap-jamaah?tahun={selectedTahun.value}
      // const response = await api.get(`/iuran/rekap-jamaah`, { params: { tahun: selectedTahun.value } });
      // setRekapData(response.data || []);

      // Simulasi API call dengan dummy data
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Filter dummy data berdasarkan tahun (jika ada logika filter di dummy)
      setRekapData(dummyRekapData); // Untuk sekarang selalu tampilkan semua dummy
    } catch (err) {
      setError("Gagal memuat data rekap iuran.");
      toast.error("Gagal memuat data rekap iuran.");
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
      // Hanya fetch jika tahun sudah dipilih
      fetchRekapData();
    }
  }, [fetchRekapData, selectedTahun]); // Tambahkan selectedTahun sebagai dependency

  // --- Kalkulasi Grand Total ---
  useEffect(() => {
    let totalSudah = 0;
    let totalBelum = 0;
    rekapData.forEach((item) => {
      totalSudah += item.total_sudah_dibayar || 0;
      totalBelum += item.total_belum_dibayar || 0;
    });
    setGrandTotalSudahDibayar(totalSudah);
    setGrandTotalBelumDibayar(totalBelum);
  }, [rekapData]);

  // --- Handlers ---
  const handleDownloadTemplate = async (jamaahId, namaJamaah) => {
    toast.info(`Memulai unduh template untuk ${namaJamaah}...`);
    try {
      // Panggil API GET /api/iuran/template-pembayaran/{jamaah_id}?tahun={selectedTahun.value}
      // Backend akan menghasilkan file Excel dan mengirimkannya sebagai download
      // const response = await api.get(`/iuran/template-pembayaran/${jamaahId}`, {
      //     params: { tahun: selectedTahun.value },
      //     responseType: 'blob', // Penting untuk download file
      // });
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `template_pembayaran_${namaJamaah.replace(/\s+/g, '_')}_${selectedTahun.value}.xlsx`);
      // document.body.appendChild(link);
      // link.click();
      // link.parentNode.removeChild(link);
      // window.URL.revokeObjectURL(url);

      // Simulasi download
      console.log(
        `Simulasi download template untuk Jamaah ID: ${jamaahId}, Tahun: ${selectedTahun?.value}`
      );
      alert(
        `Simulasi: Unduh template Excel untuk ${namaJamaah} tahun ${selectedTahun?.value}.\nFitur ini memerlukan implementasi backend.`
      );
    } catch (error) {
      toast.error("Gagal mengunduh template.");
      console.error("Download template error:", error);
    }
  };

  const handleLihatDetail = (jamaahId, tahun) => {
    // Navigasi ke halaman KelolaIuran dengan parameter
    navigate(`/kelola-iuran?jamaah_id=${jamaahId}&tahun=${tahun}`);
  };

  const handleExportRekap = () => {
    if (rekapData.length === 0) {
      toast.warn("Tidak ada data untuk diekspor.");
      return;
    }
    toast.info("Mempersiapkan data rekap untuk diunduh...");
    // Data yang akan diekspor (sesuaikan dengan kolom tabel)
    const dataToExport = rekapData.map((item) => ({
      "Nama Jamaah": item.nama_jamaah,
      "Sudah Dibayar (Rp)": item.total_sudah_dibayar,
      "Belum Dibayar (Rp)": item.total_belum_dibayar,
      "Jumlah Anggota": item.jumlah_anggota, // Tambahkan jika perlu
    }));
    // Tambahkan baris total
    dataToExport.push({}); // Baris kosong
    dataToExport.push({
      "Nama Jamaah": "TOTAL KESELURUHAN",
      "Sudah Dibayar (Rp)": grandTotalSudahDibayar,
      "Belum Dibayar (Rp)": grandTotalBelumDibayar,
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Rekap Iuran ${selectedTahun?.value || ""}`
    );
    // Atur lebar kolom (opsional)
    // worksheet['!cols'] = [ {wch:25}, {wch:20}, {wch:20}, {wch:15} ];
    XLSX.writeFile(
      workbook,
      `Rekap_Iuran_Tahun_${selectedTahun?.value || "Semua"}.xlsx`
    );
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
              <Select
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
              disabled={loading || rekapData.length === 0}
            >
              <Download size={16} /> Export Rekap
            </button>
          </div>
        </div>

        {/* Alert Error */}
        {error && !loading && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300 text-sm flex-shrink-0">
            {error}{" "}
            <button
              onClick={fetchRekapData}
              className="ml-2 font-semibold underline"
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
                    colSpan="5"
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
                          className="p-1.5 text-blue-600 hover:text-blue-800"
                          title="Unduh Template Excel Pembayaran Jamaah Ini"
                        >
                          <Download size={16} />
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
                  <td className="px-4 py-3"></td>{" "}
                  {/* Kolom kosong untuk Action */}
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
