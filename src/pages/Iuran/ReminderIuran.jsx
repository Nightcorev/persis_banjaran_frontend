import React, { useEffect, useState, useCallback, useRef } from "react";
// import { Link } from "react-router-dom"; // Mungkin tidak perlu Link di sini
import { toast } from "react-toastify";
import api from "../../utils/api"; // Instance Axios custom Anda
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const CURRENT_YEAR = new Date().getFullYear();
// Bulan saat ini (1=Jan, 2=Feb, ..., 12=Des) - Ingat index bulan dimulai dari 0
const CURRENT_MONTH_INDEX = new Date().getMonth(); // April -> 3 (Jika saat ini Mei, maka 4)
const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const ReminderIuran = () => {
  // State untuk data tabel & pagination
  const [tunggakanData, setTunggakanData] = useState([]); // Mulai dengan array kosong
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0); // Mulai dengan 0
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJamaahFilter, setSelectedJamaahFilter] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const searchTimeoutRef = useRef(null);

  // --- State untuk Seleksi ---
  const [selectedAnggotaIds, setSelectedAnggotaIds] = useState(new Set());

  // State untuk loading & error
  const [loading, setLoading] = useState(false); // Loading tabel utama
  const [loadingSend, setLoadingSend] = useState(false); // Loading untuk tombol kirim massal
  const [error, setError] = useState("");

  // State untuk data dropdown Jamaah
  const [jamaahs, setJamaah] = useState([]); // Mulai dengan array kosong

  // --- Fungsi Fetch Data ---

  // Fungsi untuk mengambil data pilihan Jamaah
  const fetchJamaah = useCallback(async () => {
    // Tidak perlu loading global agar tidak mengganggu tabel utama
    try {
      const response = await api.get(`${API_URL}/data_choice_jamaah`); // Gunakan endpoint Anda
      setJamaah(response.data.data || []); // Sesuaikan path jika perlu
    } catch (error) {
      console.error("Gagal mengambil data Jamaah:", error);
      // Mungkin tidak perlu toast error di sini
    }
  }, []); // Dependency kosong, hanya dijalankan sekali

  // Fungsi untuk mengambil data tunggakan dari backend
  const fetchTunggakanData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelectedAnggotaIds(new Set()); // Reset seleksi saat data baru di-fetch
    try {
      const params = {
        page,
        per_page: perPage,
        search: debouncedSearchTerm,

        jamaah_id: selectedJamaahFilter?.value,
        tahun: CURRENT_YEAR, // Kirim tahun relevan
      };
      // Panggil endpoint GET /iuran/tunggakan
      const response = await api.get(`${API_URL}/iuran/tunggakan`, { params });

      // Sesuaikan path data berdasarkan response pagination Laravel
      setTunggakanData(response.data.data || []);
      setTotal(response.data.total || 0); // Total data keseluruhan (bukan hanya per halaman)
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengambil data tunggakan.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Fetch Tunggakan error:", error);
      setTunggakanData([]); // Kosongkan data jika error
      setTotal(0);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, debouncedSearchTerm, selectedJamaahFilter, CURRENT_YEAR]); // Tambahkan CURRENT_YEAR jika relevan

  useEffect(() => {
    /* ... (sama) ... */ if (searchTimeoutRef.current) {
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
  // --- Initial Data Load ---
  useEffect(() => {
    fetchJamaah(); // Ambil data jamaah saat komponen pertama kali dimuat
  }, [fetchJamaah]);

  useEffect(() => {
    fetchTunggakanData(); // Ambil data tunggakan saat komponen dimuat atau filter/halaman berubah
  }, [fetchTunggakanData]); // fetchTunggakanData sudah punya dependensi sendiri

  // --- Options untuk React-Select ---
  const jamaahOptions = jamaahs.map((jamaah) => ({
    value: jamaah.id_master_jamaah, // Sesuaikan nama kolom ID jika beda
    label: jamaah.nama_jamaah,
  }));

  // --- Handler Checkbox ---
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIdsOnPage = new Set(
        tunggakanData.map((item) => item.anggota_id)
      );
      setSelectedAnggotaIds(allIdsOnPage);
    } else {
      setSelectedAnggotaIds(new Set());
    }
  };

  const handleSelectSingle = (event, anggotaId) => {
    setSelectedAnggotaIds((prevSelectedIds) => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (event.target.checked) {
        newSelectedIds.add(anggotaId);
      } else {
        newSelectedIds.delete(anggotaId);
      }
      return newSelectedIds;
    });
  };

  // Cek apakah semua di halaman ini terpilih
  const isAllSelectedOnPage =
    tunggakanData.length > 0 &&
    selectedAnggotaIds.size === tunggakanData.length &&
    tunggakanData.every((item) => selectedAnggotaIds.has(item.anggota_id));

  // --- Handler Aksi Kirim ---
  const handleSendReminder = async (anggota) => {
    try {
      // Data yang akan dikirim ke Laravel
      // const reminderData = {
      //   anggota_id: anggota.id,
      //   nama_lengkap: anggota.nama_lengkap,
      //   no_telp: anggota.no_telp,
      //   nominal_tunggakan: anggota.total_tunggakan,
      //   jumlah_bulan_tunggakan: anggota.bulan_tunggakan.length,
      //   detail_bulan_tunggakan: anggota.bulan_tunggakan.join(', ')
      // };

      // Panggil endpoint Laravel
      const response = await api.post(`${API_URL}/iuran/send_reminder`, anggota);

      toast.success(
        response.data.message ||
          `Reminder berhasil dikirim ke ${anggota.nama_lengkap}`
      );
      
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Gagal mengirim reminder";
        
      toast.error(errorMessage);
      console.error("Send reminder error:", error);
    } finally {
      setLoadingSend(false);
    }
  };

  const handleBatchSendReminder = async (idsToSend) => {
    if (!idsToSend || idsToSend.length === 0) {
      toast.warn("Tidak ada anggota terpilih untuk dikirim reminder.");
      return;
    }
    setLoadingSend(true);
    console.log("Mengirim reminder massal ke ID:", idsToSend);
    try {
      // Panggil endpoint POST /iuran/reminder/batch
      const response = await api.post(`${API_URL}/iuran/reminder/batch`, {
        anggota_ids: idsToSend,
      });

      toast.success(
        response.data.message ||
          `Reminder (simulasi) berhasil dikirim ke ${idsToSend.length} anggota terpilih.`
      );
      setSelectedAnggotaIds(new Set()); // Kosongkan seleksi setelah berhasil
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengirim reminder massal.";
      toast.error(errorMessage);
      console.error("Batch Send error:", error);
    } finally {
      setLoadingSend(false);
    }
  };

  const handleSendToJamaah = () => {
    if (!selectedJamaahFilter) return;
    // Ambil semua ID anggota yang ditampilkan DENGAN filter jamaah aktif
    const idsInFilteredJamaah = tunggakanData.map((item) => item.anggota_id); // Data sudah terfilter oleh API
    if (idsInFilteredJamaah.length === 0) {
      toast.info(
        `Tidak ada anggota dengan tunggakan di ${selectedJamaahFilter.label}.`
      );
      return;
    }
    handleBatchSendReminder(idsInFilteredJamaah);
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <div className="flex  items-center ">
          <Link
            to="/iuran/pembayaran"
            className="p-2 font-bold hover:bg-gray-200 rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">
            Kirim Reminder Tunggakan Iuran ({CURRENT_YEAR})
          </h1>
        </div>

        <p className="text-sm text-gray-600">
          Data tunggakan per bulan: {MONTH_NAMES[CURRENT_MONTH_INDEX]}
        </p>
      </div>

      {/* Filter & Pencarian */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        {/* Per Page & Filter Jamaah */}
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
            disabled={loading} // Disable saat loading
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
            isDisabled={loading} // Disable saat loading
          />
        </div>

        {/* Input Pencarian */}
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
            disabled={loading} // Disable saat loading
          />
        </div>
      </div>

      {/* Tombol Aksi Massal */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <button
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          onClick={() =>
            handleBatchSendReminder(Array.from(selectedAnggotaIds))
          }
          disabled={selectedAnggotaIds.size === 0 || loadingSend || loading}
        >
          {/* ... (Icon Kirim) ... */}
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
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
          Kirim Reminder Terpilih ({selectedAnggotaIds.size})
        </button>
        {selectedJamaahFilter && (
          <button
            className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleSendToJamaah}
            disabled={loadingSend || loading || tunggakanData.length === 0} // Disable jika tidak ada data di jamaah tsb
            title={`Kirim reminder ke semua anggota ${selectedJamaahFilter.label} yang menunggak`}
          >
            {/* ... (Icon Kirim Jamaah) ... */}
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
                d="M2.25 12.75l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 8.25V12m0 3.75h.008v.008H12v-.008z"
              />
            </svg>
            Kirim ke Semua Jamaah {selectedJamaahFilter.label}
          </button>
        )}
        {loadingSend && (
          <span className="text-sm text-gray-600 italic">Mengirim...</span>
        )}
      </div>

      {/* Alert Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}

      {/* Tabel Data Tunggakan */}
      <div className="overflow-x-auto border rounded-lg text-sm">
        <table className="table-auto w-full border-collapse border border-gray-300 text-black">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {/* Kolom Checkbox */}
              <th className="border p-2 w-10">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  onChange={handleSelectAll}
                  checked={isAllSelectedOnPage}
                  disabled={tunggakanData.length === 0 || loading}
                  title="Pilih Semua di Halaman Ini"
                />
              </th>
              {/* ... (Kolom header lainnya sama) ... */}
              <th className="border p-2 w-10">No</th>
              <th className="border p-2">Nama Anggota</th>
              <th className="border p-2">Nama Jamaah</th>
              <th className="border p-2 text-center">Tunggakan (Bln)</th>
              <th className="border p-2 text-right">Nominal Tunggakan</th>
              <th className="border p-2">Detail Bulan</th>
              <th className="border p-2 w-28">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center border p-4">
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
            ) : tunggakanData.length > 0 ? (
              tunggakanData.map((item, index) => (
                <tr
                  key={item.anggota_id}
                  className={`hover:bg-gray-50 transition duration-150 ease-in-out ${
                    selectedAnggotaIds.has(item.anggota_id) ? "bg-blue-50" : ""
                  }`}
                >
                  {/* Kolom Checkbox */}
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      checked={selectedAnggotaIds.has(item.anggota_id)}
                      onChange={(e) => handleSelectSingle(e, item.anggota_id)}
                    />
                  </td>
                  {/* ... (Kolom data lainnya sama) ... */}
                  <td className="border p-2 text-center">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td className="border p-2">{item.nama_lengkap}</td>
                  <td className="border p-2">{item.nama_jamaah}</td>
                  <td className="border p-2 text-center font-semibold text-red-600">
                    {item.jumlah_bulan_tunggakan} bln
                  </td>
                  <td className="border p-2 text-right">
                    <NumericFormat
                      value={item.nominal_tunggakan}
                      displayType={"text"}
                      thousandSeparator={"."}
                      decimalSeparator={","}
                      prefix={"Rp "}
                    />
                  </td>
                  <td className="border p-2 text-xs">
                    {item.detail_bulan_tunggakan}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      title={`Kirim reminder ke ${item.nama_lengkap}`}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs flex items-center justify-center gap-1 disabled:opacity-50"
                      onClick={() => handleSendReminder(item)}
                      disabled={loadingSend || loading}
                    >
                      {/* ... (Icon Kirim) ... */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                        />
                      </svg>
                      Kirim
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center border p-4">
                  {searchTerm || selectedJamaahFilter
                    ? "Tidak ada data tunggakan yang cocok."
                    : "Tidak ada data tunggakan."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Buttons */}
      <div className="mt-4 flex justify-between items-center text-sm">
        {/* ... (Pagination sama seperti sebelumnya) ... */}
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
    </div> // Penutup div utama
  );
};

export default ReminderIuran;
