import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
// import axios from "axios"; // Jika menggunakan axios langsung
import { toast } from "react-toastify";
import api from "../../utils/api"; // Instance Axios custom Anda
import Select from "react-select";
import { NumericFormat } from "react-number-format"; // Untuk format Rupiah

const API_URL = import.meta.env.VITE_API_BASE_URL;
const CURRENT_YEAR = new Date().getFullYear(); // Asumsi iuran tahun berjalan
const MONTHLY_FEE = 10000; // Biaya iuran per bulan

// --- SIMULASI ROLE USER ---
// Ganti ini dengan cara Anda mendapatkan role user asli (misal: dari context, props, hook)
const USER_ROLES = {
  PJ: "Pimpinan Jamaah",
  BENDAHARA: "Bendahara",
  SUPER_ADMIN: "Super Admin", // Jika ada
};
const account = JSON.parse(localStorage.getItem("user"));

// Pilih role untuk testing:
const currentUserRole = account?.role; // atau USER_ROLES.PJ

// --- DATA DUMMY (Termasuk catatan verifikasi) ---

const DataIuran = () => {
  // State untuk data tabel utama & pagination
  const [iuranSummary, setIuranSummary] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJamaahFilter, setSelectedJamaahFilter] = useState(null); // Filter tabel

  // State untuk loading & error
  const [loading, setLoading] = useState(false); // Loading tabel utama
  const [loadingModal, setLoadingModal] = useState(false); // Loading modal tambah/edit
  const [loadingVerify, setLoadingVerify] = useState(false); // Loading modal verifikasi
  const [error, setError] = useState("");

  // State untuk data dropdown
  const [jamaahs, setJamaah] = useState([]); // Pakai dummy
  const [anggotasForModal, setAnggotasForModal] = useState([]);

  // State Modal Tambah (Multi-Row)
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedJamaahModal, setSelectedJamaahModal] = useState(null);
  const [paymentRows, setPaymentRows] = useState([
    { key: Date.now(), anggota: null, nominal: "" },
  ]);

  // State Modal Edit (Single-Row)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [editNominal, setEditNominal] = useState("");
  const [editAnggotaInfo, setEditAnggotaInfo] = useState({
    nama: "",
    jamaah: "",
  });

  const [editRejectionNote, setEditRejectionNote] = useState(null); // Untuk catatan di modal edit

  // --- State Modal Verifikasi/Tolak (BARU) ---
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyModalData, setVerifyModalData] = useState(null); // { id, nama, jamaah, nominal, tanggal }
  const [rejectionNote, setRejectionNote] = useState(""); // Catatan penolakan

  // State Modal Delete
  const [showModalDelete, setShowModalDelete] = useState(null); // Menyimpan ID pembayaran

  // --- Fungsi Fetch Data (Nonaktifkan jika pakai dummy) ---

  const fetchJamaah = useCallback(async () => {
    // Aktifkan jika tidak pakai dummy
    try {
      const response = await api.get(`${API_URL}/data_choice_jamaah`);
      setJamaah(response.data.data);
    } catch (error) {
      setError("Gagal mengambil data Jamaah.");
      console.error("Fetch Jamaah error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnggotaForModal = useCallback(async (jamaahId) => {
    if (!jamaahId) {
      setAnggotasForModal([]);
      return;
    }
    setLoadingModal(true);
    try {
      // Jika pakai API:
      const response = await api.get(
        `${API_URL}/anggota/choice_by-jamaah/${jamaahId}`
      );
      setAnggotasForModal(response.data.data || []);
      console.log(response.data.data);
    } catch (error) {
      toast.error("Gagal mengambil data Anggota.");
      console.error("Fetch Anggota error:", error);
      setAnggotasForModal([]);
    } finally {
      setLoadingModal(false);
    }
  }, []);

  const fetchIuranSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        per_page: perPage,
        search: searchTerm,
        jamaah_id: selectedJamaahFilter?.value, // Kirim ID jika filter dipilih
        tahun: CURRENT_YEAR, // Kirim tahun relevan
      };
      const response = await api.get(`${API_URL}/iuran/summary`, { params });
      setIuranSummary(response.data.data || []); // Sesuaikan path data
      setTotal(response.data.total || 0); // Sesuaikan path total
    } catch (error) {
      setError("Gagal mengambil data iuran.");
      toast.error("Gagal mengambil data iuran.");
      console.error("Fetch Iuran Summary error:", error);
      setIuranSummary([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, searchTerm, selectedJamaahFilter]); // Dependensi fetch

  // --- Initial Data Load (Nonaktifkan jika pakai dummy) ---
  useEffect(() => {
    fetchJamaah();
  }, [fetchJamaah]);

  useEffect(() => {
    fetchIuranSummary();
  }, [fetchIuranSummary]);

  // --- Options untuk React-Select ---
  const jamaahOptions = jamaahs.map((jamaah) => ({
    value: jamaah.id_master_jamaah,
    label: jamaah.nama_jamaah,
  }));

  const getAvailableAnggotaOptions = (currentRowKey) => {
    const selectedAnggotaIds = paymentRows
      .filter((row) => row.key !== currentRowKey && row.anggota)
      .map((row) => row.anggota.value);
    return anggotasForModal
      .filter((anggota) => !selectedAnggotaIds.includes(anggota.id_anggota))
      .map((anggota) => ({
        value: anggota.id_anggota,
        label: `${anggota.nama_lengkap} (${anggota.no_telp || "N/A"})`,
      }));
  };

  // --- Handler Modal Tambah (Multi-Row) ---
  const openAddModal = () => {
    /* ... (sama seperti sebelumnya) ... */
    setSelectedJamaahModal(null);
    setPaymentRows([{ key: Date.now(), anggota: null, nominal: "" }]);
    setAnggotasForModal([]);
    setShowAddModal(true);
  };
  const handleJamaahChangeModal = (selectedOption) => {
    /* ... (sama seperti sebelumnya) ... */
    setSelectedJamaahModal(selectedOption);
    setPaymentRows([{ key: Date.now(), anggota: null, nominal: "" }]);
    if (selectedOption) {
      fetchAnggotaForModal(selectedOption.value);
    } else {
      setAnggotasForModal([]);
    }
  };
  const handleRowChange = (key, field, value) => {
    /* ... (sama seperti sebelumnya) ... */
    setPaymentRows((prevRows) =>
      prevRows.map((row) =>
        row.key === key ? { ...row, [field]: value } : row
      )
    );
  };
  const addPaymentRow = () => {
    /* ... (sama seperti sebelumnya) ... */
    setPaymentRows((prevRows) => [
      ...prevRows,
      { key: Date.now(), anggota: null, nominal: "" },
    ]);
  };
  const removePaymentRow = (key) => {
    /* ... (sama seperti sebelumnya) ... */
    setPaymentRows((prevRows) => prevRows.filter((row) => row.key !== key));
  };
  const handleSubmitAdd = async (e) => {
    /* ... (sama seperti sebelumnya, pastikan API call benar) ... */
    e.preventDefault();
    const validRows = paymentRows.filter(
      (row) => row.anggota && row.nominal > 0
    );
    if (!selectedJamaahModal) {
      toast.warn("Silakan pilih Jamaah.");
      return;
    }
    if (validRows.length === 0) {
      toast.warn("Minimal tambahkan satu pembayaran valid.");
      return;
    }
    const payload = validRows.map((row) => ({
      anggota_id: row.anggota.value,
      nominal: parseFloat(row.nominal) || 0,
    }));
    setLoadingModal(true);
    try {
      console.log(payload);
      await api.post(`${API_URL}/iuran/pay`, { payments: payload }); // Kirim sbg object dg key 'payments'
      toast.success(
        `Pembayaran untuk ${payload.length} anggota berhasil dicatat (Pending)`
      );
      setShowAddModal(false);
      console.log("API Add Success. Attempting to fetch summary...");
      fetchIuranSummary(); // Pastikan baris ini tidak di-comment
      console.log("fetchIuranSummary called.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal menyimpan data pembayaran."
      );
      console.error("Submit Add error:", error);
    } finally {
      setLoadingModal(false);
    }
  };

  // --- Handler Modal Edit ---
  const openEditModal = async (paymentId) => {
    if (!paymentId) {
      toast.error("Tidak ada data pembayaran yang bisa diedit.");
      return;
    }
    setEditingPaymentId(paymentId);
    setEditRejectionNote(null); // Reset catatan saat modal dibuka
    setLoadingModal(true);
    setShowEditModal(true);
    try {
      // Fetch detail pembayaran spesifik (lebih baik daripada hanya dari summary)
      const response = await api.get(`${API_URL}/iuran/payment/${paymentId}`);
      const paymentData = response.data.data; // Sesuaikan path jika perlu

      setEditNominal(paymentData.nominal);
      setEditAnggotaInfo({
        nama: paymentData.anggota?.nama_lengkap || "N/A",
        jamaah: paymentData.anggota?.master_jamaah?.nama_jamaah || "N/A", // Akses melalui relasi anggota
      });
      console.log(paymentData);
      // Simpan catatan verifikasi jika ada
      if (paymentData.status === "Failed" && paymentData.catatan_verifikasi) {
        setEditRejectionNote(paymentData.catatan_verifikasi);
      }
    } catch (error) {
      toast.error("Gagal mengambil detail pembayaran untuk diedit.");
      console.error("Open Edit Modal error:", error);
      setShowEditModal(false); // Tutup modal jika gagal fetch
    } finally {
      setLoadingModal(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    /* ... (sama seperti sebelumnya, pastikan API call benar) ... */
    e.preventDefault();
    if (!editNominal || editNominal <= 0) {
      toast.warn("Nominal tidak valid.");
      return;
    }
    setLoadingModal(true);
    try {
      const payload = { nominal: parseFloat(editNominal) || 0 };
      await api.put(`${API_URL}/iuran/edit/${editingPaymentId}`, payload);
      toast.success("Nominal berhasil diperbarui.");
      setShowEditModal(false);
      setEditingPaymentId(null);
      fetchIuranSummary(); // Aktifkan jika tidak pakai dummy
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui nominal."
      );
      console.error("Submit Edit error:", error);
    } finally {
      setLoadingModal(false);
    }
  };

  // --- Handler Modal Verifikasi/Tolak (BARU) ---
  const handleOpenVerifyModal = (item) => {
    setVerifyModalData({
      id: item.id_pembayaran_terakhir_untuk_aksi,
      nama: item.nama_lengkap,
      jamaah: item.nama_jamaah,
      nominal: item.nominal_terakhir, // Asumsi ada di summary
      tanggal: item.tanggal_input_terakhir, // Asumsi ada di summary
    });
    setRejectionNote(""); // Reset catatan
    setShowVerifyModal(true);
  };

  const handleVerify = async () => {
    if (!verifyModalData?.id) return;
    setLoadingVerify(true);
    try {
      await api.put(`${API_URL}/iuran/verify/${verifyModalData.id}`);
      toast.success("Pembayaran berhasil diverifikasi.");
      setShowVerifyModal(false);
      setVerifyModalData(null);
      fetchIuranSummary(); // Aktifkan jika tidak pakai dummy
      // Update dummy data secara manual jika testing
      // setIuranSummary((prev) =>
      //   prev.map((item) =>
      //     item.id_pembayaran_terakhir_untuk_aksi === verifyModalData.id
      //       ? {
      //           ...item,
      //           status_terakhir: "Verified",
      //           id_pembayaran_terakhir_untuk_aksi: null,
      //           catatan_verifikasi: null,
      //         }
      //       : item
      //   )
      // );
    } catch (error) {
      toast.error("Gagal verifikasi pembayaran.");
      console.error("Verify error:", error);
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleReject = async () => {
    if (!verifyModalData?.id) return;
    if (!rejectionNote.trim()) {
      toast.warn("Silakan masukkan alasan penolakan.");
      return;
    }
    setLoadingVerify(true);
    try {
      const payload = { catatan: rejectionNote };
      await api.put(`${API_URL}/iuran/reject/${verifyModalData.id}`, payload);
      toast.warn("Pembayaran ditolak (Failed).");
      setShowVerifyModal(false);
      setVerifyModalData(null);
      fetchIuranSummary(); // Refresh
      // Update dummy data secara manual jika testing
      setIuranSummary((prev) =>
        prev.map((item) =>
          item.id_pembayaran_terakhir_untuk_aksi === verifyModalData.id
            ? {
                ...item,
                status_terakhir: "Failed",
                catatan_verifikasi: rejectionNote,
              } // ID aksi tetap ada
            : item
        )
      );
    } catch (error) {
      toast.error("Gagal menolak pembayaran.");
      console.error("Reject error:", error);
    } finally {
      setLoadingVerify(false);
    }
  };

  // --- Handler Delete ---
  const handleDelete = async () => {
    /* ... (sama seperti sebelumnya, pastikan API call benar) ... */
    if (!showModalDelete) return;
    setLoading(true); // Bisa pakai loading global atau spesifik modal delete
    try {
      await api.delete(`${API_URL}/iuran/${showModalDelete}`);
      toast.success("Data pembayaran berhasil dihapus!");
      setShowModalDelete(null);
      fetchIuranSummary(); // Refresh
      // Update dummy data secara manual jika testing
      setIuranSummary((prev) =>
        prev.filter(
          (item) => item.id_pembayaran_terakhir_untuk_aksi !== showModalDelete
        )
      );
      // Perlu update 'total' juga jika pakai dummy
      setTotal((prev) => prev - 1);
    } catch (error) {
      toast.error("Gagal menghapus data pembayaran.");
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Render Helper ---
  const renderMonthCells = (totalPaid) => {
    /* ... (sama seperti sebelumnya) ... */
    const paidMonthsCount = Math.floor(totalPaid / MONTHLY_FEE);
    const months = [
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
    return months.map((month, monthIndex) => (
      <td
        key={`${month}-${monthIndex}`}
        className="border p-1 text-center text-xs"
      >
        {monthIndex < paidMonthsCount ? (
          <span
            title={`Lunas s/d ${months[paidMonthsCount - 1]}`}
            className="text-green-600 font-semibold"
          >
            ✓
          </span>
        ) : (
          <span title="Belum Lunas" className="text-gray-400">
            ✗
          </span>
        )}
      </td>
    ));
  };

  const getStatusBadge = (status, note) => {
    // Tambah parameter note
    let badge;
    switch (status?.toLowerCase()) {
      case "verified":
        badge = (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-400">
            Verified
          </span>
        );
        break;
      case "pending":
        badge = (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded border border-yellow-300">
            Pending
          </span>
        );
        break;
      case "failed":
        badge = (
          <span className="relative group bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded border border-red-400">
            Failed
            {/* Tooltip untuk catatan penolakan */}
            {note && (
              <span className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-700 text-white text-xs rounded py-1 px-2 z-10 break-words shadow-lg">
                {note}
              </span>
            )}
          </span>
        );
        break;
      default:
        badge = (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-500">
            N/A
          </span>
        );
    }
    return badge;
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg">
      {/* Header & Tombol Aksi Utama */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h1 className="text-xl font-bold text-gray-800">
          Kelola Data Iuran ({CURRENT_YEAR})
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tombol Reminder (tampil untuk semua?) */}
          <button className="px-3 py-2 bg-sky-600 text-white text-sm rounded-lg hover:bg-sky-700 whitespace-nowrap">
            <Link to="/iuran/reminder">Kirim Reminder Iuran</Link>
          </button>
          {/* Tombol Tambah Pembayaran (hanya PJ) */}
          {(currentUserRole === USER_ROLES.PJ ||
            currentUserRole === USER_ROLES.SUPER_ADMIN) && (
            <button
              className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 whitespace-nowrap"
              onClick={openAddModal}
            >
              + Pembayaran Iuran
            </button>
          )}
        </div>
      </div>

      {/* Filter & Pencarian */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        {/* ... (Filter sama seperti sebelumnya) ... */}
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <label>Tampilkan:</label>
          <select
            value={perPage}
            onChange={(e) => {
              setPage(1);
              setPerPage(Number(e.target.value));
            }}
            className="border p-2 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            style={{ maxWidth: "70px" }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <label>Jamaah:</label>
          <Select
            options={jamaahOptions}
            value={selectedJamaahFilter}
            onChange={(option) => {
              setPage(1);
              setSelectedJamaahFilter(option);
            }}
            isClearable
            isSearchable
            placeholder="Semua Jamaah..."
            className="w-48 z-20"
            styles={{ control: (base) => ({ ...base, minHeight: "42px" }) }}
          />
        </div>
        <div className="flex items-center text-sm">
          <label htmlFor="search" className="mr-2">
            Cari:
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setPage(1);
              setSearchTerm(e.target.value);
            }}
            placeholder="Cari Nama Anggota..."
            className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Alert Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}

      {/* Tabel Data */}
      <div className="overflow-x-auto border rounded-lg text-sm">
        <table className="table-auto w-full border-collapse border border-gray-300 text-black">
          {/* ... (thead sama seperti sebelumnya) ... */}
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border p-2 w-10" rowSpan="2">
                No
              </th>
              <th className="border p-2 min-w-[150px]" rowSpan="2">
                Nama Anggota
              </th>
              <th className="border p-2 min-w-[120px]" rowSpan="2">
                Nama Jamaah
              </th>
              <th className="border p-2 text-center" colSpan="12">
                Status Pembayaran Bulan ({CURRENT_YEAR})
              </th>
              <th className="border p-2 min-w-[100px]" rowSpan="2">
                Total Bayar ({CURRENT_YEAR})
              </th>
              <th className="border p-2 min-w-[90px]" rowSpan="2">
                Status Terakhir
              </th>
              <th className="border p-2 min-w-[120px]" rowSpan="2">
                Action
              </th>
            </tr>
            <tr>
              <th className="border p-1 font-normal text-xs w-[35px]">Jan</th>
              <th className="border p-1 font-normal text-xs w-[35px]">Feb</th>
              <th className="border p-1 font-normal text-xs w-[35px]">Mar</th>
              <th className="border p-1 font-normal text-xs w-[35px]">Apr</th>
              <th className="border p-1 font-normal text-xs w-[35px]">Mei</th>
              <th className="border p-1 font-normal text-xs w-[35px]">Jun</th>
              <th className="border p-1 font-normal text-xs w-[35px]">Jul</th>
              <th className="border p-1 font-normal text-xs w-[35px]">Ags</th>
              <th className="border p-1 font-normal text-xs w-[35px]">Sep</th>
              <th className="border p-1 font-normal text-xs w-[35px]">Okt</th>
              <th className="border p-1 font-normal text-xs w-[35px]">Nov</th>
              <th className="border p-1 font-normal text-xs w-[35px]">Des</th>
            </tr>
          </thead>
          <tbody>
            {loading /* ... (Loading state sama) ... */ ? (
              <tr>
                <td colSpan="17" className="text-center border p-4">
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Memuat data...
                  </div>
                </td>
              </tr>
            ) : iuranSummary.length > 0 ? (
              iuranSummary.map((item, index) => (
                <tr
                  key={item.anggota_id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  {/* Kolom Nomor, Nama, Jamaah, Bulan, Total */}
                  <td className="border p-2 text-center">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td className="border p-2">{item.nama_lengkap}</td>
                  <td className="border p-2">{item.nama_jamaah}</td>
                  {renderMonthCells(item.total_nominal_bayar_tahun_ini)}
                  <td className="border p-2 text-right">
                    <NumericFormat
                      value={item.total_nominal_bayar_tahun_ini}
                      displayType={"text"}
                      thousandSeparator={"."}
                      decimalSeparator={","}
                      prefix={"Rp "}
                    />
                  </td>
                  {/* Kolom Status (dengan tooltip catatan) */}
                  <td className="border p-2 text-center">
                    {getStatusBadge(
                      item.status_terakhir,
                      item.catatan_verifikasi
                    )}
                  </td>
                  {/* Kolom Action (berdasarkan role) */}
                  <td className="border p-2 text-center">
                    <div className="flex justify-center items-center gap-1 flex-wrap">
                      {/* Tombol Review (hanya Bendahara, jika status Pending) */}
                      {(currentUserRole === USER_ROLES.BENDAHARA ||
                        currentUserRole === USER_ROLES.SUPER_ADMIN) &&
                        item.id_pembayaran_terakhir_untuk_aksi &&
                        item.status_terakhir?.toLowerCase() === "pending" && (
                          <button
                            title="Review Pembayaran"
                            className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                            onClick={() => handleOpenVerifyModal(item)} // Buka modal verifikasi
                          >
                            {/* Icon Review/Eye */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                          </button>
                        )}
                      {/* Tombol Edit (hanya PJ/Super Admin, jika status Pending/Failed) */}
                      {(currentUserRole === USER_ROLES.PJ ||
                        currentUserRole === USER_ROLES.SUPER_ADMIN) &&
                        item.id_pembayaran_terakhir_untuk_aksi &&
                        ["pending", "failed"].includes(
                          item.status_terakhir?.toLowerCase()
                        ) && (
                          <button
                            title="Edit Nominal Pembayaran"
                            className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                            onClick={() =>
                              openEditModal(
                                item.id_pembayaran_terakhir_untuk_aksi
                              )
                            }
                          >
                            {/* Icon Edit */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                          </button>
                        )}
                      {/* Tombol Delete (hanya PJ/Super Admin, jika status Pending/Failed) */}
                      {(currentUserRole === USER_ROLES.PJ ||
                        currentUserRole === USER_ROLES.SUPER_ADMIN) &&
                        item.id_pembayaran_terakhir_untuk_aksi &&
                        ["pending", "failed"].includes(
                          item.status_terakhir?.toLowerCase()
                        ) && (
                          <button
                            title="Hapus Pembayaran"
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                            onClick={() =>
                              setShowModalDelete(
                                item.id_pembayaran_terakhir_untuk_aksi
                              )
                            }
                          >
                            {/* Icon Delete */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              /* ... (Pesan tidak ada data sama) ... */
              <tr>
                <td colSpan="17" className="text-center border p-4">
                  {searchTerm || selectedJamaahFilter
                    ? "Tidak ada data yang cocok."
                    : "Tidak ada data iuran."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Buttons */}
      <div className="mt-4 flex justify-between items-center text-sm">
        {" "}
        {/* ... (Sama seperti sebelumnya) ... */}
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || loading}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Prev
        </button>
        <span>
          Halaman {page} dari {Math.ceil(total / perPage)} (Total: {total} data)
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= Math.ceil(total / perPage) || loading}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* --- Modals --- */}

      {/* Modal Tambah Pembayaran (Multi-Row) */}
      {showAddModal /* ... (JSX Modal Tambah sama seperti sebelumnya) ... */ && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-30">
          <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Tambah Pembayaran Iuran
            </h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pilih Jamaah:
                </label>
                <Select
                  options={jamaahOptions}
                  value={selectedJamaahModal}
                  onChange={handleJamaahChangeModal}
                  isClearable
                  isSearchable
                  placeholder="Pilih Jamaah untuk filter Anggota..."
                  className="w-full"
                  isDisabled={loadingModal}
                />
              </div>
              <div className="space-y-3 mb-4 border-t pt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Detail Pembayaran Anggota:
                </label>
                {paymentRows.map((row, index) => (
                  <div
                    key={row.key}
                    className="flex items-center gap-2 border p-2 rounded bg-gray-50"
                  >
                    <div className="flex-1">
                      <Select
                        options={getAvailableAnggotaOptions(row.key)}
                        value={row.anggota}
                        onChange={(option) =>
                          handleRowChange(row.key, "anggota", option)
                        }
                        isSearchable
                        placeholder={`Anggota ${index + 1}...`}
                        className="text-sm"
                        isDisabled={!selectedJamaahModal || loadingModal}
                        isLoading={loadingModal && index === 0}
                      />
                    </div>
                    <NumericFormat
                      value={row.nominal}
                      onValueChange={(values) => {
                        const { floatValue } = values;
                        handleRowChange(row.key, "nominal", floatValue);
                      }}
                      thousandSeparator={"."}
                      decimalSeparator={","}
                      prefix="Rp "
                      placeholder="Nominal..."
                      className="border p-2 rounded w-36 text-sm text-right"
                      disabled={!selectedJamaahModal}
                    />
                    {paymentRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePaymentRow(row.key)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Hapus Baris Ini"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPaymentRow}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-2 disabled:opacity-50"
                  disabled={!selectedJamaahModal || loadingModal}
                >
                  + Tambah Anggota Lain
                </button>
              </div>
              <div className="mt-5 flex justify-end space-x-3 border-t pt-4">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 text-sm"
                  onClick={() => setShowAddModal(false)}
                  disabled={loadingModal}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm disabled:opacity-50"
                  disabled={loadingModal}
                >
                  {loadingModal ? "Menyimpan..." : "Simpan Pembayaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Pembayaran (Single-Row) */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-30">
          <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Edit Nominal Pembayaran
            </h2>
            {loadingModal ? (
              <div className="text-center p-5">Memuat detail...</div>
            ) : (
              <form onSubmit={handleSubmitEdit}>
                {/* --- TAMPILKAN CATATAN JIKA ADA --- */}
                {editRejectionNote && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-sm text-red-800">
                    <p className="font-semibold mb-1">
                      Catatan Verifikasi Sebelumnya:
                    </p>
                    <p>{editRejectionNote}</p>
                  </div>
                )}
                {/* --- AKHIR BAGIAN CATATAN --- */}

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Anggota:
                  </label>
                  <p className="mt-1 text-sm text-gray-900 font-semibold">
                    {editAnggotaInfo.nama}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Jamaah:
                  </label>
                  <p className="mt-1 text-sm text-gray-600">
                    {editAnggotaInfo.jamaah}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edit Nominal: <span className="text-red-500">*</span>
                  </label>
                  <NumericFormat
                    value={editNominal}
                    onValueChange={(values) =>
                      setEditNominal(values.floatValue)
                    }
                    thousandSeparator={"."}
                    decimalSeparator={","}
                    prefix="Rp "
                    placeholder="Masukkan nominal yang benar..."
                    className="border p-2 rounded w-full text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    required // Tambahkan validasi dasar
                  />
                </div>
                {/* Tombol Aksi Modal Edit */}
                <div className="mt-5 flex justify-end space-x-3 border-t pt-4">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 text-sm"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingPaymentId(null);
                      setEditRejectionNote(null);
                    }} // Reset catatan juga
                    disabled={loadingModal}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm disabled:opacity-50"
                    disabled={loadingModal || !editNominal || editNominal <= 0} // Disable jika nominal tidak valid
                  >
                    {loadingModal ? "Menyimpan..." : "Update Nominal"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- Modal Verifikasi/Tolak (BARU) --- */}
      {showVerifyModal && verifyModalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-40">
          <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Review Pembayaran Iuran
            </h2>

            {/* Detail Pembayaran */}
            <div className="space-y-2 mb-4 text-sm">
              <p>
                <span className="font-semibold w-24 inline-block">
                  Anggota:
                </span>{" "}
                {verifyModalData.nama}
              </p>
              <p>
                <span className="font-semibold w-24 inline-block">Jamaah:</span>{" "}
                {verifyModalData.jamaah}
              </p>
              <p>
                <span className="font-semibold w-24 inline-block">
                  Nominal:
                </span>
                <NumericFormat
                  value={verifyModalData.nominal}
                  displayType={"text"}
                  thousandSeparator={"."}
                  decimalSeparator={","}
                  prefix={"Rp "}
                />
              </p>
              <p>
                <span className="font-semibold w-24 inline-block">
                  Tgl. Input:
                </span>{" "}
                {verifyModalData.tanggal
                  ? new Date(verifyModalData.tanggal).toLocaleDateString(
                      "id-ID"
                    )
                  : "N/A"}
              </p>
            </div>

            {/* Input Alasan Penolakan */}
            <div className="mb-4">
              <label
                htmlFor="rejectionNote"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Alasan Penolakan (jika ditolak):
              </label>
              <textarea
                id="rejectionNote"
                rows="3"
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                placeholder="Masukkan alasan jika pembayaran ini ditolak..."
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                disabled={loadingVerify}
              ></textarea>
            </div>

            {/* Tombol Aksi Modal Verifikasi */}
            <div className="mt-5 flex justify-end space-x-3 border-t pt-4">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 text-sm"
                onClick={() => {
                  setShowVerifyModal(false);
                  setVerifyModalData(null);
                }}
                disabled={loadingVerify}
              >
                Batal
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm disabled:opacity-50"
                onClick={handleReject}
                disabled={loadingVerify || !rejectionNote.trim()} // Disable jika loading atau catatan kosong
                title={
                  !rejectionNote.trim()
                    ? "Masukkan alasan untuk menolak"
                    : "Tolak pembayaran"
                }
              >
                {loadingVerify ? "Memproses..." : "Tolak"}
              </button>
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm disabled:opacity-50"
                onClick={handleVerify}
                disabled={loadingVerify}
              >
                {loadingVerify ? "Memproses..." : "Verifikasi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showModalDelete /* ... (JSX Modal Delete sama seperti sebelumnya) ... */ && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-40">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold text-gray-800">
              Konfirmasi Hapus
            </h2>
            <p className=" text-gray-600 mt-2">
              Apakah Anda yakin ingin menghapus data pembayaran ini (ID:{" "}
              {showModalDelete})? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowModalDelete(null)}
                disabled={loading}
              >
                Batal
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div> // Penutup div utama
  );
};

export default DataIuran;
