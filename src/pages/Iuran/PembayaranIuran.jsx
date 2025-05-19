import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api"; // Sesuaikan path jika utils ada di level berbeda
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import {
  Upload,
  History,
  CalendarDays,
  Settings,
  CircleCheck,
  CircleX,
  Clock,
  Info,
  Trash2,
  Plus,
  Loader2,
  Download,
  Search,
  Eye,
  Edit,
  ListChecks,
  AlertTriangle,
  Send,
  PenBox,
  Bell,
} from "lucide-react";

// Impor komponen modal yang sudah dipisah
import ImportModal from "../../components/KelolaIuran/ImportModal"; // Path relatif dari pages ke components
import HistoryModal from "../../components/KelolaIuran/HistoryModal";
import ValidationModal from "../../components/KelolaIuran/ValidationModal";
import ManageTahunModal from "../../components/KelolaIuran/ManageTahunModal";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const MONTHLY_FEE = 10000;
const MONTH_NAMES = [
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

const statusFilterOptions = [
  { value: "", label: "Semua Status Pembayaran" },
  { value: "Pending", label: "Pending" },
  { value: "Verified", label: "Verified (Lunas)" },
  { value: "Failed", label: "Failed (Gagal)" },
  // Opsi 'Belum Lunas' bisa lebih kompleks karena melibatkan ketiadaan data
];

// --- Helper ---
const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);
const formatDateTime = (isoString) => {
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

// --- Komponen Utama Halaman ---
const KelolaIuran = () => {
  // --- State ---
  const [iuranData, setIuranData] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState({});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedJamaahFilter, setSelectedJamaahFilter] = useState(null);
  const [selectedTahun, setSelectedTahun] = useState(null);
  const [tahunOptions, setTahunOptions] = useState([]);
  const [jamaahOptions, setJamaahOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingTahun, setLoadingTahun] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [error, setError] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [tahunListManage, setTahunListManage] = useState(false);
  const [isManageTahunModalOpen, setIsManageTahunModalOpen] = useState(false);
  const [loadingTemplatePj, setLoadingTemplatePj] = useState(false);
  const [historyTarget, setHistoryTarget] = useState({
    anggotaId: null,
    nama: "",
    tahun: null,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [historyData, setHistoryData] = useState([]);
  const [isInputMode, setIsInputMode] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [pendingLogsData, setPendingLogsData] = useState([]);
  const [loadingValidationLogs, setLoadingValidationLogs] = useState(false);
  const [validationTarget, setValidationTarget] = useState({
    anggotaId: null,
    nama: "",
    tahun: null,
  });
  const searchTimeoutRef = useRef(null);
  const [grandTotalSudahDibayar, setGrandTotalSudahDibayar] = useState(0);
  const [grandTotalBelumDibayar, setGrandTotalBelumDibayar] = useState(0);
  // Di dalam KelolaIuran.jsx
  const [pendingCount, setPendingCount] = useState(0);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(null); // Untuk filter status

  // Data User & Role
  const account = JSON.parse(localStorage.getItem("user")) || {
    role: "Bendahara",
  }; // Default role jika tidak ada
  const isBendaharaOrAdmin = ["Bendahara", "Super Admin"].includes(
    account?.role
  );
  const isPjUser = account?.role === "Pimpinan Jamaah";

  const pjJamaahId = isPjUser ? account?.id_master_jamaah : null;
  const [pjJamaahName, setPjJamaahName] = useState("");

  // console.log(pjJamaahId);

  const canInputIuran = [
    "Pimpinan Jamaah",
    "Bendahara",
    "Super Admin",
  ].includes(account?.role);

  // --- Fetch Data ---
  const fetchTahunAktif = useCallback(
    async (tahunFromUrl = null) => {
      setLoadingTahun(true);
      try {
        const response = await api.get("/tahun-aktif");
        const options = (response.data || []).map((th) => ({
          value: th.tahun,
          label: th.tahun.toString(),
        }));
        setTahunOptions(options);

        if (tahunFromUrl) {
          // Jika ada tahun dari URL, prioritaskan itu
          const tahunObjFromUrl = options.find(
            (opt) => opt.value === parseInt(tahunFromUrl)
          );
          if (tahunObjFromUrl) {
            setSelectedTahun(tahunObjFromUrl);
          } else if (options.length > 0) {
            // Jika tahun dari URL tidak valid, fallback
            setSelectedTahun(options[0]);
            toast.warn(
              `Tahun ${tahunFromUrl} tidak ditemukan, menampilkan tahun ${options[0].value}.`
            );
          } else {
            setSelectedTahun(null);
          }
        } else if (!selectedTahun && options.length > 0) {
          // Jika tidak ada dari URL & belum ada yg dipilih
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
        } else if (options.length === 0) {
          setSelectedTahun(null);
        }
        // Jika selectedTahun sudah ada dan valid, biarkan saja (tidak di-override)
      } catch (err) {
        toast.error("Gagal memuat data tahun.");
        console.error("Fetch Tahun Error:", err);
      } finally {
        setLoadingTahun(false);
      }
    },
    [selectedTahun]
  ); // selectedTahun dihapus dari dependency agar tidak re-fetch saat dipilih

  const fetchJamaah = useCallback(
    async (jamaahIdFromUrl = null) => {
      try {
        const response = await api.get(`${API_URL}/data_choice_jamaah`);
        const options = (response.data.data || []).map((j) => ({
          value: j.id_master_jamaah,
          label: j.nama_jamaah,
        }));
        setJamaahOptions(options);

        let initialJamaahFilter = null;
        if (isPjUser && pjJamaahId) {
          // Jika PJ, set filter otomatis
          initialJamaahFilter = options.find((opt) => opt.value === pjJamaahId);
          //console.log("Initial Jamaah Filter:", initialJamaahFilter.label);
          if (initialJamaahFilter) {
            setPjJamaahName(initialJamaahFilter.label); // Simpan nama jamaah PJ
          } else {
            console.warn(
              `Jamaah PJ dengan ID ${pjJamaahId} tidak ditemukan di options.`
            );
          }
        } else if (jamaahIdFromUrl) {
          // Jika ada dari URL (untuk non-PJ)
          initialJamaahFilter = options.find(
            (opt) => opt.value === parseInt(jamaahIdFromUrl)
          );
          if (!initialJamaahFilter) {
            toast.warn(`Jamaah dengan ID ${jamaahIdFromUrl} tidak ditemukan.`);
          }
        }

        setSelectedJamaahFilter(initialJamaahFilter);
      } catch (error) {
        console.error("Gagal mengambil data Jamaah:", error);
      }
    },
    [isPjUser, pjJamaahId]
  );

  const fetchPendingCount = useCallback(async () => {
    if (!selectedTahun?.value || !isBendaharaOrAdmin) {
      setPendingCount(0); // Reset jika tidak relevan
      return;
    }
    try {
      const response = await api.get("/iuran/pending-count", {
        params: { tahun: selectedTahun.value },
      });
      setPendingCount(response.data.pending_count || 0);
    } catch (error) {
      console.error("Error fetching pending count:", error);
      setPendingCount(0); // Set 0 jika error
    }
  }, [selectedTahun, isBendaharaOrAdmin]);

  const fetchIuranSummary = useCallback(async () => {
    if (!selectedTahun?.value) {
      setIuranData([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    setError(null);
    setSelectedMonths({});
    try {
      const params = {
        page,
        per_page: perPage,
        search: debouncedSearchTerm,
        jamaah_id: selectedJamaahFilter?.value,
        tahun: selectedTahun.value,
        _t: Date.now(),
        filter_status_bulan: selectedStatusFilter?.value, // <-- Kirim filter status
      };
      const response = await api.get(`/iuran/summary`, { params });
      const items = response.data.data || [];
      const totalItems = response.data.total || 0;
      setIuranData(items);
      setTotal(totalItems);
      // Setelah fetch summary, update juga pending count
      if (isBendaharaOrAdmin) fetchPendingCount();
    } catch (err) {
      setError("Gagal memuat data iuran.");
      setIuranData([]);
      setTotal(0);
      console.error("Fetch Iuran Error:", err);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    perPage,
    debouncedSearchTerm,
    selectedJamaahFilter,
    selectedTahun,
    selectedStatusFilter,
    fetchPendingCount,
    isBendaharaOrAdmin,
  ]); // Tambah selectedStatusFilter & fetchPendingCount

  // --- Debounce Search ---
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Fetch data awal
  useEffect(() => {
    const jamaahIdFromUrl = searchParams.get("jamaah_id");
    const tahunFromUrl = searchParams.get("tahun");

    //console.log("URL Params:", { jamaahIdFromUrl, tahunFromUrl });
    //console.log("Pj jamaah : ", pjJamaahName);

    // Fetch tahun dulu, lalu set selectedTahun (termasuk dari URL jika ada)
    // Kemudian fetch jamaah, lalu set selectedJamaahFilter (termasuk dari URL jika ada)
    // fetchIuranSummary akan terpicu oleh perubahan selectedTahun atau selectedJamaahFilter
    fetchTahunAktif(tahunFromUrl).then(() => {
      fetchJamaah(jamaahIdFromUrl);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Hanya dijalankan sekali saat mount untuk membaca URL params

  // Fetch data iuran ketika filter atau halaman berubah
  useEffect(() => {
    if (selectedTahun && (selectedJamaahFilter || isPjUser)) {
      // Fetch jika tahun dan jamaah (atau PJ) sudah ada
      fetchIuranSummary();
    } else if (selectedTahun && !isPjUser && !selectedJamaahFilter) {
      // Jika bukan PJ dan filter jamaah dihapus, fetch semua
      fetchIuranSummary();
    }
  }, [fetchIuranSummary]);

  // --- Kalkulasi Grand Total ---
  useEffect(() => {
    let currentPageSudahDibayar = 0;
    let currentPageBelumDibayar = 0;
    const nominalHarusBayarSetahunPenuh = 12 * MONTHLY_FEE;

    iuranData.forEach((item) => {
      let rowSudahDibayar = 0;
      if (item.bulan_status) {
        for (let i = 1; i <= 12; i++) {
          if (item.bulan_status[i]?.status === "Verified") {
            rowSudahDibayar += MONTHLY_FEE;
          }
        }
      }
      currentPageSudahDibayar += rowSudahDibayar;
      const rowBelumDibayar = Math.max(
        0,
        nominalHarusBayarSetahunPenuh - rowSudahDibayar
      );
      currentPageBelumDibayar += rowBelumDibayar;
    });
    setGrandTotalSudahDibayar(currentPageSudahDibayar);
    setGrandTotalBelumDibayar(currentPageBelumDibayar);
  }, [iuranData, selectedTahun]);

  // --- Handlers ---
  const handleMonthCheckboxChange = (anggotaId, monthIndex) => {
    setSelectedMonths((prev) => {
      const currentSelection = prev[anggotaId]
        ? new Set(prev[anggotaId])
        : new Set();
      const monthNumber = monthIndex + 1;
      if (currentSelection.has(monthNumber)) {
        currentSelection.delete(monthNumber);
      } else {
        currentSelection.add(monthNumber);
      }
      if (currentSelection.size === 0) {
        const { [anggotaId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [anggotaId]: currentSelection };
    });
  };

  const handleBayar = async (anggotaId) => {
    const monthsToPay = selectedMonths[anggotaId];
    if (!monthsToPay || monthsToPay.size === 0) {
      toast.warn("Pilih bulan yang akan dibayar.");
      return;
    }
    if (!selectedTahun) {
      toast.error("Tahun iuran belum dipilih.");
      return;
    }
    if (
      !window.confirm(
        `Anda akan mencatat pembayaran untuk ${monthsToPay.size} bulan. Lanjutkan?`
      )
    )
      return;

    setLoading(true); // Bisa juga loading spesifik per baris
    try {
      await api.post("/iuran/pay-months", {
        anggota_id: anggotaId,
        tahun: selectedTahun.value,
        months: Array.from(monthsToPay),
        role: account.role, // Kirim role user
      });
      toast.success("Pembayaran berhasil dicatat!");
      fetchIuranSummary(); // Refresh data
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mencatat pembayaran.");
      console.error("Pay Months Error:", err);
      setLoading(false); // Matikan loading jika error
    }
    // setLoading akan dimatikan oleh fetchIuranSummary jika sukses
  };

  const handleImport = async (file) => {
    if (!selectedTahun) {
      toast.error("Pilih tahun iuran terlebih dahulu sebelum mengimpor.");
      throw new Error("Tahun belum dipilih");
    }
    setLoadingImport(true);
    const formData = new FormData();
    formData.append("file_import", file);
    formData.append("tahun", selectedTahun.value);
    try {
      const response = await api.post("/iuran/import", formData); // Tidak perlu set header Content-Type
      toast.success(
        response.data.message || "File sedang diproses untuk impor."
      );
      fetchIuranSummary();
    } catch (err) {
      if (
        err.response &&
        err.response.status === 422 &&
        err.response.data.errors
      ) {
        const errorMessages = Array.isArray(err.response.data.errors)
          ? err.response.data.errors.join("\n")
          : JSON.stringify(err.response.data.errors);
        toast.error(
          <div>
            Impor Gagal:
            <br />
            <pre className="text-xs whitespace-pre-wrap">{errorMessages}</pre>
          </div>,
          { autoClose: 10000 }
        );
      } else {
        toast.error(err.response?.data?.message || "Gagal mengimpor file.");
      }
      console.error("Import Error:", err);
      throw err;
    } finally {
      setLoadingImport(false);
    }
  };

  const handleOpenHistory = async (anggotaId, namaLengkap) => {
    if (!selectedTahun) {
      toast.warn("Pilih tahun terlebih dahulu.");
      return;
    }
    setIsHistoryModalOpen(true);
    setLoadingHistory(true);
    setHistoryTarget({
      anggotaId,
      nama: namaLengkap,
      tahun: selectedTahun.value,
    });
    setHistoryData([]);
    try {
      const response = await api.get(`/iuran/history/${anggotaId}`, {
        params: { tahun: selectedTahun.value },
      });
      setHistoryData(response.data || []);
    } catch (err) {
      toast.error("Gagal memuat riwayat pembayaran.");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleOpenValidationModal = async (anggotaId, namaLengkap) => {
    if (!selectedTahun) {
      toast.warn("Pilih tahun terlebih dahulu.");
      return;
    }
    setIsValidationModalOpen(true);
    setLoadingValidationLogs(true);
    setValidationTarget({
      anggotaId,
      nama: namaLengkap,
      tahun: selectedTahun.value,
    });
    setPendingLogsData([]);
    try {
      const response = await api.get(`/iuran/pending-logs/${anggotaId}`, {
        params: { tahun: selectedTahun.value },
      });
      setPendingLogsData(response.data || []);
    } catch (err) {
      toast.error("Gagal memuat data pending.");
    } finally {
      setLoadingValidationLogs(false);
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

  const handleVerifyLog = async (logId) => {
    /* ... (sama, panggil fetchPendingCount setelahnya) ... */ if (
      !window.confirm("Verifikasi pembayaran ini?")
    )
      return;
    setLoadingValidationLogs(true);
    try {
      await api.put(`/iuran/verify-log/${logId}`);
      toast.success("Pembayaran diverifikasi!");
      if (isValidationModalOpen) {
        handleOpenValidationModal(
          validationTarget.anggotaId,
          validationTarget.nama
        );
      }
      fetchIuranSummary();
      fetchPendingCount();
      setIsValidationModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal verifikasi.");
    } finally {
      setLoadingValidationLogs(false);
    }
  };
  const handleRejectLog = async (logId, catatan) => {
    /* ... (sama, panggil fetchPendingCount setelahnya) ... */ setLoadingValidationLogs(
      true
    );
    try {
      await api.put(`/iuran/reject-log/${logId}`, { catatan });
      toast.warn("Pembayaran ditolak (Failed).");
      if (isValidationModalOpen) {
        handleOpenValidationModal(
          validationTarget.anggotaId,
          validationTarget.nama
        );
      }
      fetchIuranSummary();
      fetchPendingCount();
      setIsValidationModalOpen(false);
      n;
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menolak.");
    } finally {
      setLoadingValidationLogs(false);
    }
  };

  const handleDownloadPjTemplate = async () => {
    if (!pjJamaahId || !selectedTahun?.value) {
      toast.warn("Informasi jamaah atau tahun tidak lengkap.");
      return;
    }
    setLoadingTemplatePj(true);
    toast.info(`Mempersiapkan template untuk jamaah Anda...`);
    try {
      const response = await api.get(
        `/iuran/template-pembayaran/${pjJamaahId}`,
        {
          params: { tahun: selectedTahun.value },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = `template_pembayaran_${(
        pjJamaahName || `jamaah_${pjJamaahId}`
      ).replace(/\s+/g, "_")}_${selectedTahun.value}.xlsx`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`Template berhasil diunduh.`);
    } catch (error) {
      toast.error(error.response?.data?.message || `Gagal mengunduh template.`);
      console.error("Download PJ template error:", error);
    } finally {
      setLoadingTemplatePj(false);
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen w-full">
      {" "}
      <div className="max-w-full mx-auto bg-white p-5 sm:p-6 rounded-lg shadow-md flex flex-col">
        {/* Header & Tombol Aksi Utama */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b gap-2 flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-800">
            Kelola Pembayaran Iuran
          </h1>
          <div className="flex flex-wrap gap-2">
            {!isInputMode && (
              <Link to="/iuran/reminder">
                <button className="flex items-center gap-1 px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm shadow-sm">
                  <Send size={16} /> Kirim Reminder Iuran
                </button>
              </Link>
            )}
            {isBendaharaOrAdmin && isInputMode && (
              <button
                onClick={() => setIsManageTahunModalOpen(true)}
                className="flex items-center gap-1 px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 text-sm shadow-sm disabled:opacity-50"
                disabled={loading || loadingTahun}
              >
                <Settings size={16} /> Kelola Tahun
              </button>
            )}
            {isInputMode && (isBendaharaOrAdmin || isPjUser) && (
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-1 px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm shadow-sm disabled:opacity-50"
                disabled={loading || loadingImport}
              >
                <Upload size={16} /> Impor Excel
              </button>
            )}
            {canInputIuran && (
              <button
                onClick={() => setIsInputMode((prev) => !prev)}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm shadow-sm ${
                  isInputMode
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-green-600 text-white hover:bg-green-800"
                }`}
                title={
                  isInputMode
                    ? "Batal Input Pembayaran"
                    : "Aktifkan Mode Input Pembayaran"
                }
              >
                {isInputMode ? <Eye size={16} /> : <PenBox size={16} />}
                {isInputMode ? "Mode View" : "Mode Edit"}
              </button>
            )}
          </div>
        </div>

        {/* Notifikasi Pending (BARU) */}
        {isBendaharaOrAdmin && pendingCount > 0 && !loading && (
          <div className="mb-4 p-3 bg-orange-100 border-l-4 border-orange-500 rounded text-orange-700 flex items-center justify-between flex-wrap gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Bell size={18} />
              <span>
                Ada <strong>{pendingCount} anggota</strong> dengan iuran
                menunggu validasi untuk tahun {selectedTahun?.label || ""}.
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedStatusFilter(
                  statusFilterOptions.find((opt) => opt.value === "Pending")
                );
                // Scroll ke tabel jika perlu: document.getElementById('tabel-iuran').scrollIntoView();
              }}
              className="px-3 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 shadow-sm"
            >
              Lihat Data Pending
            </button>
          </div>
        )}

        {/* Filter */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-end flex-shrink-0">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tahun Iuran
            </label>
            <Select
              options={tahunOptions}
              value={selectedTahun}
              onChange={setSelectedTahun}
              placeholder="Pilih Tahun..."
              isLoading={loadingTahun}
              isDisabled={loading || loadingTahun}
              className="text-sm z-30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jamaah
            </label>
            <Select
              options={jamaahOptions}
              value={selectedJamaahFilter}
              onChange={setSelectedJamaahFilter}
              isClearable={!isPjUser} // Tidak bisa clear jika PJ
              isSearchable={!isPjUser}
              placeholder={isPjUser ? pjJamaahName : "Semua Jamaah..."}
              isDisabled={loading || isPjUser} // Disable jika PJ
              className="text-sm z-20"
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9998 }) }}
              menuPortalTarget={document.body}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Bayar
            </label>
            <Select
              options={statusFilterOptions}
              value={selectedStatusFilter}
              onChange={(option) => {
                setPage(1);
                setSelectedStatusFilter(option);
              }}
              placeholder="Filter Status..."
              isClearable={false} // Biasanya filter status tidak perlu clear, pilih "Semua"
              isDisabled={loading}
              className="text-sm z-10"
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9997 }) }}
              menuPortalTarget={document.body}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tampilkan
            </label>
            <select
              value={perPage}
              onChange={(e) => {
                setPage(1);
                setPerPage(Number(e.target.value));
              }}
              className="border border-gray-300 p-2 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm w-full"
              disabled={loading}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cari Anggota
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nama anggota..."
                className="border border-gray-300 p-2 pl-8 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm w-full"
                disabled={loading}
              />
              <Search
                size={16}
                className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Alert Error */}
        {error && !loading && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300 text-sm flex-shrink-0">
            {error}{" "}
            <button
              onClick={fetchIuranSummary}
              className="ml-2 font-semibold underline"
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
           
          <div className="overflow-x-auto max-h-[65vh] border rounded-lg text-sm">
                       {" "}
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th
                    rowSpan="2"
                    className="px-2 py-3 text-left font-medium  uppercase tracking-wider w-10 sticky left-0 bg-gray-50 z-10 border-r"
                  >
                    No
                  </th>
                  <th
                    rowSpan="2"
                    className="px-3 py-3 text-left font-medium  uppercase tracking-wider min-w-[150px] sticky left-10 bg-gray-50 z-10 border-r"
                  >
                    Nama Anggota
                  </th>
                  <th
                    rowSpan="2"
                    className="px-3 py-3 text-left font-medium  uppercase tracking-wider min-w-[120px]"
                  >
                    Jamaah
                  </th>
                  <th
                    colSpan={MONTH_NAMES.length}
                    className="px-3 py-2 text-center font-medium  uppercase tracking-wider border-b"
                  >
                    Bulan Pembayaran ({selectedTahun?.value || "..."})
                  </th>
                  <th
                    colSpan="2"
                    className="px-3 py-2 text-center font-medium  uppercase tracking-wider border-b"
                  >
                    Rincian Pembayaran ({selectedTahun?.value || "..."})
                  </th>
                  <th
                    rowSpan="2"
                    className="px-3 py-3 text-center font-medium  uppercase tracking-wider min-w-[100px]"
                  >
                    Action
                  </th>
                </tr>
                <tr>
                  {MONTH_NAMES.map((month, index) => (
                    <th
                      key={index}
                      className="px-1 py-1 text-center font-medium  border-l w-[50px]"
                    >
                      {month}
                    </th>
                  ))}
                  {/* Sub-header untuk Rincian */}
                  <th className="px-3 py-2 text-right font-medium  border-l uppercase tracking-wider">
                    Sudah Dibayar
                  </th>
                  <th className="px-3 py-2 text-right font-medium  border-l uppercase tracking-wider">
                    Belum Dibayar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!loading && iuranData.length === 0 && (
                  <tr>
                    <td
                      colSpan={3 + MONTH_NAMES.length + 2 + 1}
                      className="text-center p-5 text-gray-500 italic"
                    >
                      {searchTerm || selectedJamaahFilter
                        ? "Tidak ada data iuran yang cocok."
                        : "Tidak ada data iuran untuk tahun ini."}
                    </td>
                  </tr>
                )}
                {!loading &&
                  iuranData.map((item, index) => {
                    const currentSelection =
                      selectedMonths[item.anggota_id] || new Set();
                    let nominalSudahDibayar = 0;
                    if (item.bulan_status) {
                      for (let i = 1; i <= 12; i++) {
                        if (item.bulan_status[i]?.status === "Verified") {
                          nominalSudahDibayar += MONTHLY_FEE;
                        }
                      }
                    }
                    const nominalHarusBayarSetahunPenuh = 12 * MONTHLY_FEE;
                    const nominalBelumDibayar = Math.max(
                      0,
                      nominalHarusBayarSetahunPenuh - nominalSudahDibayar
                    );
                    let hasPendingMonth = false;
                    if (item.bulan_status) {
                      for (let i = 1; i <= 12; i++) {
                        if (item.bulan_status[i]?.status === "Pending") {
                          hasPendingMonth = true;
                          break;
                        }
                      }
                    }

                    return (
                      <tr key={item.anggota_id} className="hover:bg-gray-50">
                        <td className="px-2 py-2 whitespace-nowrap text-center text-gray-500 sticky left-0 bg-white hover:bg-gray-50 border-r">
                          {(page - 1) * perPage + index + 1}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900 sticky left-10 bg-white hover:bg-gray-50 border-r">
                          {item.nama_lengkap}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                          {item.nama_jamaah}
                        </td>
                        {MONTH_NAMES.map((_, monthIndex) => {
                          const monthNumber = monthIndex + 1;
                          const monthInfo = item.bulan_status?.[
                            monthNumber
                          ] || {
                            status: "Belum Lunas",
                            catatan: null,
                          };
                          const status = monthInfo.status;
                          const catatan = monthInfo.catatan;
                          const isChecked = currentSelection.has(monthNumber);
                          const canCheck =
                            status === "Belum Lunas" || status === "Failed";
                          const isDisabled =
                            status === "Verified" || status === "Pending";
                          let cellContent;
                          if (isInputMode && canCheck) {
                            cellContent = (
                              <input
                                type="checkbox"
                                className="form-checkbox h-3.5 w-3.5 text-blue-600 rounded focus:ring-blue-500 mx-auto block disabled:opacity-50 disabled:cursor-not-allowed"
                                checked={isChecked}
                                onChange={() =>
                                  handleMonthCheckboxChange(
                                    item.anggota_id,
                                    monthIndex
                                  )
                                }
                                disabled={loading}
                                title={
                                  status === "Failed"
                                    ? `Gagal: ${
                                        catatan || "Klik History u/ detail"
                                      }. Centang untuk input ulang.`
                                    : "Pilih untuk bayar"
                                }
                              />
                            );
                          } else {
                            if (status === "Verified") {
                              cellContent = (
                                <CircleCheck
                                  size={14}
                                  className="text-green-500 mx-auto"
                                  title={`Lunas - Verified`}
                                />
                              );
                            } else if (status === "Pending") {
                              cellContent = (
                                <Clock
                                  size={14}
                                  className="text-yellow-500 mx-auto"
                                  title={`Pending Verifikasi`}
                                />
                              );
                            } else if (status === "Failed") {
                              cellContent = (
                                <div className="relative flex justify-center group">
                                  <AlertTriangle
                                    size={14}
                                    className="text-red-500 mx-auto"
                                  />
                                  {catatan && (
                                    <span className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-[200px] bg-gray-700 text-white text-xs rounded py-1 px-2 z-10 break-words shadow-lg text-center">
                                      Gagal: {catatan}
                                    </span>
                                  )}
                                </div>
                              );
                            } else {
                              cellContent = (
                                <CircleX
                                  size={14}
                                  className="text-gray-400 mx-auto"
                                  title={`Belum Lunas`}
                                />
                              );
                            }
                          }
                          return (
                            <td
                              key={monthIndex}
                              className={`px-1 py-1 text-center border-l ${
                                isInputMode && canCheck
                                  ? "cursor-pointer hover:bg-blue-50"
                                  : ""
                              }`}
                            >
                              {cellContent}
                            </td>
                          );
                        })}
                        <td className="px-3 py-2 whitespace-nowrap text-right text-green-600 font-medium">
                          {formatRupiah(nominalSudahDibayar)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-right text-red-600 font-medium">
                          {formatRupiah(nominalBelumDibayar)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">
                          <div className="flex justify-center items-center gap-1">
                            {isInputMode && (
                              <button
                                onClick={() => handleBayar(item.anggota_id)}
                                className="p-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={
                                  !selectedMonths[item.anggota_id] ||
                                  selectedMonths[item.anggota_id].size === 0 ||
                                  loading
                                }
                                title="Catat Pembayaran"
                              >
                                <CircleCheck size={14} />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleOpenHistory(
                                  item.anggota_id,
                                  item.nama_lengkap
                                )
                              }
                              className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                              title="Lihat Riwayat (Lunas & Gagal)"
                            >
                              <History size={14} />
                            </button>
                            {isBendaharaOrAdmin && hasPendingMonth && (
                              <button
                                onClick={() =>
                                  handleOpenValidationModal(
                                    item.anggota_id,
                                    item.nama_lengkap
                                  )
                                }
                                className="p-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                                title="Validasi Pembayaran Pending"
                              >
                                <ListChecks size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
              {!loading && iuranData.length > 0 && (
                <tfoot className="bg-gray-100 font-semibold">
                  <tr>
                    <td
                      colSpan={3 + MONTH_NAMES.length}
                      className="px-3 py-3 text-right text-gray-700 uppercase"
                    >
                      Total Halaman Ini:
                    </td>
                    <td className="px-3 py-3 text-right text-green-700">
                      {formatRupiah(grandTotalSudahDibayar)}
                    </td>
                    <td className="px-3 py-3 text-right text-red-700">
                      {formatRupiah(grandTotalBelumDibayar)}
                    </td>
                    <td className="px-3 py-3"></td>
                  </tr>
                </tfoot>
              )}
            </table>{" "}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex-shrink-0">
          {!loading && total > 0 && Math.ceil(total / perPage) > 1 && (
            <div className="flex justify-between items-center text-sm">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
              >
                Prev
              </button>
              <span>
                Halaman {page} dari {Math.ceil(total / perPage)} (Total: {total}
                )
              </span>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page >= Math.ceil(total / perPage)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {/* --- Modals --- */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        loading={loadingImport}
        // Props BARU untuk PJ
        isPjUser={isPjUser}
        pjJamaahInfo={
          isPjUser
            ? {
                id: pjJamaahId,
                nama: pjJamaahName,
                tahun: selectedTahun?.value,
              }
            : null
        }
        onDownloadPjTemplate={handleDownloadPjTemplate}
        loadingTemplatePj={loadingTemplatePj}
      />
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        historyData={historyData}
        loading={loadingHistory}
        target={historyTarget}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        pendingLogs={pendingLogsData}
        loading={loadingValidationLogs}
        target={validationTarget}
        onVerify={handleVerifyLog}
        onReject={handleRejectLog}
      />
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

export default KelolaIuran;
