import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api"; // Instance Axios Anda
import axios from "axios"; // Tetap untuk upload file jika endpoint terpisah
import Select from "react-select"; // Untuk dropdown multi-select
import {
  Plus,
  Search,
  Eye,
  X,
  UploadCloud,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Loader2,
  Users,
  UserCheck,
} from "lucide-react";

// --- Helper Functions (Sama seperti sebelumnya) ---
const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (error) {
    return "Invalid Date";
  }
};
const getFileIcon = (filename) => {
  if (!filename) return <Paperclip size={18} className="text-gray-500" />;
  const extension = filename.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
    return <ImageIcon size={18} className="text-blue-600" />;
  }
  if (extension === "pdf") {
    return <FileText size={18} className="text-red-600" />;
  }
  return <Paperclip size={18} className="text-gray-600" />;
};

// --- Modal Component: Tambah Broadcast (Dimodifikasi) ---
function AddBroadcastModal({ isOpen, onClose, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    pesan: "",
    lampiran_server: null, // Nama file dari server setelah upload
    status_pengiriman: "",
    waktu_pengiriman: "",
    tujuan: "", // Pilihan: 'semua', 'PJ', 'nomor_tertentu'
    target_ids: [], // Array ID anggota jika tujuan 'nomor_tertentu'
  });
  const [fileObject, setFileObject] = useState(null); // Untuk menyimpan objek File sementara
  const [uploadedFileNameDisplay, setUploadedFileNameDisplay] = useState(""); // Untuk tampilan nama file

  // State untuk dropdown anggota
  const [allAnggotaOptions, setAllAnggotaOptions] = useState([]);
  const [selectedAnggotaForBroadcast, setSelectedAnggotaForBroadcast] =
    useState([]); // Untuk react-select
  const [loadingAnggota, setLoadingAnggota] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({
        pesan: "",
        lampiran_server: null,
        status_pengiriman: "",
        waktu_pengiriman: "",
        tujuan: "",
        target_ids: [],
      });
      setFileObject(null);
      setUploadedFileNameDisplay("");
      setSelectedAnggotaForBroadcast([]);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Fetch daftar anggota jika 'nomor_tertentu' dipilih
  useEffect(() => {
    const fetchAllAnggota = async () => {
      if (form.tujuan === "nomor_tertentu" && isOpen) {
        setLoadingAnggota(true);
        try {
          // Ganti dengan endpoint API Anda untuk mengambil semua anggota
          // Asumsi response: [{ id_anggota: 1, nama_lengkap: 'Nama A' }, ...]
          const response = await api.get(`/anggota/all`); // Contoh endpoint
          const options = (response.data.data || response.data || []).map(
            (anggota) => ({
              value: anggota.id_anggota, // ID tetap sebagai value internal react-select
              label: `${anggota.nama_lengkap} (${anggota.no_telp || 'N/A'}) `, // Tampilkan no_telp di label
              no_telp: anggota.no_telp, // Simpan no_telp di objek opsi
            })
          );
          setAllAnggotaOptions(options);
        } catch (error) {
          console.error("Error fetching all anggota:", error);
          toast.error("Gagal memuat daftar anggota.");
          setAllAnggotaOptions([]);
        } finally {
          setLoadingAnggota(false);
        }
      } else {
        // Reset jika pilihan tujuan berubah dari 'nomor_tertentu'
        setAllAnggotaOptions([]);
        setSelectedAnggotaForBroadcast([]);
      }
    };
    fetchAllAnggota();
  }, [form.tujuan, isOpen]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setFileObject(null);
      setUploadedFileNameDisplay("");
      setForm((prev) => ({ ...prev, lampiran_server: null }));
      return;
    }

    setFileObject(file);
    setUploadedFileNameDisplay(`Mengunggah ${file.name}...`);

    const data = new FormData();
    data.append("file", file);
    data.append("namaFile", file.name);

    try {
      // Ganti URL ini dengan endpoint upload Anda
      const res = await axios.post(
        "http://localhost:3000/upload-attachment",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        setForm((prev) => ({ ...prev, lampiran_server: res.data.filename }));
        setUploadedFileNameDisplay(res.data.filename);
        toast.success("Lampiran berhasil diunggah.");
      } else {
        setUploadedFileNameDisplay("Upload Gagal");
        toast.error(res.data.message || "Upload lampiran gagal.");
        setFileObject(null);
        setForm((prev) => ({ ...prev, lampiran_server: null }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadedFileNameDisplay("Upload Gagal");
      toast.error("Upload lampiran gagal.");
      setFileObject(null);
      setForm((prev) => ({ ...prev, lampiran_server: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormState = { ...form, [name]: value };

    if (name === "status_pengiriman") {
      if (value === "Langsung") {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const formattedNow = `${year}-${month}-${day}T${hours}:${minutes}`;
        newFormState = { ...newFormState, waktu_pengiriman: formattedNow };
      }
    }
    // Jika tujuan diubah, reset target_ids dan selectedAnggotaForBroadcast
    if (name === "tujuan" && value !== "nomor_tertentu") {
      newFormState.target_ids = [];
      setSelectedAnggotaForBroadcast([]);
    }
    setForm(newFormState);
  };

  const handleAnggotaSelectChange = (selectedOptions) => {
    setSelectedAnggotaForBroadcast(selectedOptions || []);
    setForm((prev) => ({
      ...prev,
      // Ambil no_telp dari setiap opsi yang dipilih
      target_ids: (selectedOptions || [])
        .map((opt) => opt.no_telp)
        .filter(Boolean), // Filter null/undefined no_telp
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pesan || !form.tujuan || !form.status_pengiriman) {
      toast.warn(
        "Harap isi semua field yang wajib diisi (Penerima, Pesan, Status Pengiriman)."
      );
      return;
    }
    if (form.status_pengiriman === "Terjadwal" && !form.waktu_pengiriman) {
      toast.warn("Harap tentukan waktu pengiriman untuk broadcast terjadwal.");
      return;
    }
    if (form.tujuan === "nomor_tertentu" && form.target_ids.length === 0) {
      toast.warn('Pilih minimal satu anggota untuk penerima "Nomor Tertentu".');
      return;
    }

    setIsSubmitting(true);
    const dataToSend = new FormData();
    dataToSend.append("pesan", form.pesan);
    dataToSend.append("tujuan", form.tujuan);
    dataToSend.append("status_pengiriman", form.status_pengiriman);

    if (form.status_pengiriman === "Terjadwal") {
      dataToSend.append("waktu_pengiriman", form.waktu_pengiriman);
    }
    if (form.status_pengiriman === "Langsung") {
      dataToSend.append("waktu_pengiriman", form.waktu_pengiriman);
    }
    if (form.lampiran_server) {
      // Kirim nama file dari server
      dataToSend.append("lampiran", form.lampiran_server);
    }
    if (form.tujuan === "nomor_tertentu") {
      // Kirim array ID sebagai string JSON atau biarkan Laravel handle array
      form.target_ids.forEach((id) => dataToSend.append("target_ids[]", id));
    }

    try {
      await onSubmit(dataToSend);
      onClose();
    } catch (error) {
      // Error handling sudah di parent onSubmit
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Tambah Informasi Broadcast
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Penerima */}
          <div>
            <label
              htmlFor="tujuan"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Penerima <span className="text-red-500">*</span>
            </label>
            <select
              id="tujuan"
              name="tujuan"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={handleChange}
              value={form.tujuan}
              required
            >
              <option value="" disabled>
                -- Pilih Penerima --
              </option>
              <option value="semua_anggota">Semua Anggota</option>
              <option value="semua_pj">Semua Pimpinan Jamaah (PJ)</option>
              <option value="nomor_tertentu">
                Nomor Tertentu (Pilih Anggota)
              </option>
              {/* <option value="test">Test (Nomor Tertentu)</option> */}
            </select>
          </div>

          {/* Dropdown Anggota (jika 'nomor_tertentu' dipilih) */}
          {form.tujuan === "nomor_tertentu" && (
            <div>
              <label
                htmlFor="anggota_select"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pilih Anggota Penerima <span className="text-red-500">*</span>
              </label>
              <Select
                id="anggota_select"
                isMulti
                options={allAnggotaOptions}
                value={selectedAnggotaForBroadcast}
                onChange={handleAnggotaSelectChange}
                isLoading={loadingAnggota}
                placeholder={
                  loadingAnggota
                    ? "Memuat anggota..."
                    : "Ketik untuk mencari anggota..."
                }
                className="text-sm"
                classNamePrefix="react-select"
                noOptionsMessage={() => "Tidak ada anggota ditemukan"}
              />
              {selectedAnggotaForBroadcast.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedAnggotaForBroadcast.length} anggota terpilih.
                </p>
              )}
            </div>
          )}

          {/* Pesan */}
          <div>
            <label
              htmlFor="pesan"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pesan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="pesan"
              name="pesan"
              rows="5"
              placeholder="Masukkan isi pesan broadcast..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={handleChange}
              value={form.pesan}
              required
            ></textarea>
          </div>

          {/* Lampiran */}
          <div>
            <label
              htmlFor="lampiran_input"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lampiran (Opsional - Gambar/PDF)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="lampiran_input"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Unggah file</span>
                    <input
                      id="lampiran_input"
                      name="lampiran_obj"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                    />
                  </label>
                  <p className="pl-1">atau tarik dan lepas</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, PDF maksimal 5MB
                </p>
                {uploadedFileNameDisplay && (
                  <p className="text-xs text-gray-700 mt-2 truncate">
                    {uploadedFileNameDisplay}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Status & Waktu Pengiriman */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="status_pengiriman"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status Pengiriman <span className="text-red-500">*</span>
              </label>
              <select
                id="status_pengiriman"
                name="status_pengiriman"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={handleChange}
                value={form.status_pengiriman}
                required
              >
                <option value="" disabled>
                  -- Pilih Status --
                </option>
                <option value="Langsung">Kirim Langsung</option>
                <option value="Terjadwal">Kirim Terjadwal</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="waktu_pengiriman"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Waktu Pengiriman
              </label>
              <input
                type="datetime-local"
                id="waktu_pengiriman"
                name="waktu_pengiriman"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  form.status_pengiriman !== "Terjadwal"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                value={form.waktu_pengiriman}
                onChange={handleChange}
                disabled={form.status_pengiriman !== "Terjadwal"}
                required={form.status_pengiriman === "Terjadwal"}
                min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
              />
              {form.status_pengiriman === "Terjadwal" &&
                !form.waktu_pengiriman && (
                  <p className="text-xs text-red-500 mt-1">
                    Waktu wajib diisi.
                  </p>
                )}
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-3 pt-5 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : null}
              {isSubmitting ? "Mengirim..." : "Kirim Broadcast"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Modal Component: Detail Broadcast (Sama) ---
function BroadcastDetailModal({ isOpen, onClose, data }) {
  /* ... (Kode modal detail tidak berubah) ... */
  if (!isOpen || !data) return null;
  const attachmentBaseUrl = "http://localhost:3000/public/uploads/broadcast/";
  const attachmentUrl = data.lampiran
    ? `${attachmentBaseUrl}${data.lampiran}`
    : null;
  const isPdf = attachmentUrl && data.lampiran.toLowerCase().endsWith(".pdf");
  const isImage =
    attachmentUrl &&
    ["jpg", "jpeg", "png", "gif", "webp"].some((ext) =>
      data.lampiran.toLowerCase().endsWith(ext)
    );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Detail Broadcast
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <p>
            <strong className="font-medium text-gray-600 w-32 inline-block">
              Waktu Kirim:
            </strong>{" "}
            {formatDateTime(data.waktu_pengiriman) || "Langsung"}
          </p>
          <p>
            <strong className="font-medium text-gray-600 w-32 inline-block">
              Status Jadwal:
            </strong>{" "}
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                data.status_pengiriman === "Langsung"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {data.status_pengiriman || "N/A"}
            </span>
          </p>
          <p>
            <strong className="font-medium text-gray-600 w-32 inline-block">
              Penerima:
            </strong>{" "}
            {data.tujuan || "N/A"}
          </p>
          <p>
            <strong className="font-medium text-gray-600 w-32 inline-block">
              Pengirim:
            </strong>{" "}
            {data.pengirim || "Sistem"}
          </p>
          <div className="pt-2 mt-2 border-t border-gray-100">
            <strong className="font-medium text-gray-600 block mb-1">
              Pesan:
            </strong>
            <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-200">
              {data.pesan || "-"}
            </p>
          </div>
          {attachmentUrl && (
            <div className="pt-2 mt-2 border-t border-gray-100">
              <strong className="font-medium text-gray-600 block mb-2">
                Lampiran:
              </strong>
              {isPdf ? (
                <iframe
                  src={attachmentUrl}
                  className="w-full h-[400px] border rounded"
                  title="PDF Lampiran"
                />
              ) : isImage ? (
                <img
                  src={attachmentUrl}
                  alt="Lampiran Gambar"
                  className="w-full max-h-[400px] object-contain border rounded bg-gray-100"
                />
              ) : (
                <a
                  href={attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                >
                  {getFileIcon(data.lampiran)} {data.lampiran}
                </a>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Modal Component: Preview Lampiran (BARU) ---
function AttachmentPreviewModal({ isOpen, onClose, filename }) {
  if (!isOpen || !filename) return null;

  // Tentukan URL lampiran (sesuaikan base URL jika perlu)
  const attachmentBaseUrl = "http://localhost:3000/public/uploads/broadcast/"; // Ganti dengan URL base Anda
  const attachmentUrl = `${attachmentBaseUrl}${filename}`;
  const isPdf = filename.toLowerCase().endsWith(".pdf");
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].some((ext) =>
    filename.toLowerCase().endsWith(ext)
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70 p-4">
      {" "}
      {/* z-index lebih tinggi */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-4 relative max-h-[90vh]">
        {/* Tombol Close di pojok */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        {/* Konten Preview */}
        <div className="overflow-auto max-h-[calc(90vh-4rem)]">
          {" "}
          {/* Batasi tinggi konten */}
          {isPdf ? (
            <iframe
              src={attachmentUrl}
              className="w-full h-[75vh] border" // Tinggi disesuaikan
              title={`Preview PDF: ${filename}`}
            />
          ) : isImage ? (
            <img
              src={attachmentUrl}
              alt={`Lampiran: ${filename}`}
              className="w-full h-auto max-h-[80vh] object-contain" // Tinggi max
            />
          ) : (
            <div className="text-center p-10">
              <p className="mb-4 text-gray-600">
                Preview tidak tersedia untuk tipe file ini.
              </p>
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                {getFileIcon(filename)} Unduh {filename}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Komponen Utama Halaman ---
const KelolaBroadcast = () => {
  // --- State (Tambahkan kembali state modal lampiran) ---
  const [informations, setInformations] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState(null);
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false); // <-- State BARU
  const [selectedAttachment, setSelectedAttachment] = useState(null); // <-- State BARU
  const [error, setError] = useState(null);
  const searchTimeoutRef = useRef(null);

  // Mengambil data user/permissions
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
  const account = JSON.parse(localStorage.getItem("user"));

  // --- Fungsi Fetch Data (Sama) ---
  const fetchData = useCallback(async () => {
    /* ... (Kode fetch tidak berubah) ... */
    setLoading(true);
    setError(null);
    console.log("Fetching data with:", {
      page,
      perPage,
      search: debouncedSearchTerm,
    });
    try {
      const response = await api.get(`/broadcast`, {
        params: { page, perPage, search: debouncedSearchTerm },
      });
      //console.log("API Response:", response.data);
      setInformations(response.data.data.data || []);
      setTotal(response.data.data.total || 0);
      //console.log("Total data set to:", response.data.data.total || 0);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal memuat data broadcast.";
      setError(errorMessage);
      console.error("Error fetching broadcast data:", err);
      setInformations([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, debouncedSearchTerm]);

  // --- Debounce Search (Sama) ---
  useEffect(() => {
    /* ... (Kode debounce tidak berubah) ... */
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

  // Ambil data saat komponen dimuat atau dependensi fetch berubah
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Fungsi Handler ---
  const handleOpenAddModal = () => setAddModalOpen(true);
  const handleCloseAddModal = () => setAddModalOpen(false);

  const handleOpenDetailModal = (data) => {
    setSelectedDetailData(data);
    setDetailModalOpen(true);
  };
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedDetailData(null);
  };

  // Handler BARU untuk modal lampiran
  const handleOpenAttachmentModal = (filename) => {
    setSelectedAttachment(filename);
    setAttachmentModalOpen(true);
  };
  const handleCloseAttachmentModal = () => {
    setAttachmentModalOpen(false);
    setSelectedAttachment(null);
  };

  // Handle submit dari modal tambah (Sama)
  const handleAddSubmit = async (formData) => {
    /* ... (Kode submit tidak berubah) ... */
    try {
      const response = await api.post("/broadcast", formData);
      formData.forEach((value, key) => {
        console.log(key + ': ' + value);
      });
      toast.success(response.data.message || "Broadcast berhasil ditambahkan!");
      handleCloseAddModal();
      fetchData();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal menambahkan broadcast.";
      toast.error(errorMessage);
      console.error("Error adding broadcast:", err);
      throw err;
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className=" mx-auto bg-white p-5 sm:p-6 rounded-lg shadow-md">
        {/* Header Halaman (Sama) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">
            Kelola Informasi Broadcast
          </h1>
          {(account?.role === "Super Admin" ||
            permissions.includes("create_broadcast")) && (
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm shadow-sm"
              disabled={loading}
            >
              <Plus size={18} /> Tambah Broadcast
            </button>
          )}
        </div>

        {/* Filter & Pencarian (Sama) */}
        <div className="mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <label className="text-gray-600">Tampilkan:</label>
            <select
              value={perPage}
              onChange={(e) => {
                setPage(1);
                setPerPage(Number(e.target.value));
              }}
              className="border border-gray-300 p-2 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              style={{ maxWidth: "80px" }}
              disabled={loading}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-gray-600">data</span>
          </div>
          <div className="relative flex items-center text-sm">
            <input
              id="search"
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan pesan..."
              className="border border-gray-300 p-2 pl-8 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm w-full sm:w-64"
              disabled={loading}
            />
            <Search
              size={16}
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* Alert Error (Sama) */}
        {error && !loading && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300 text-sm">
            {error}{" "}
            <button
              onClick={fetchData}
              className="ml-2 font-semibold underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Tabel Data */}
        <div className="overflow-x-auto max-h-[65vh] border rounded-lg text-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {/* ... (Header tabel sama) ... */}
                <th
                  scope="col"
                  className="px-4 py-3 text-left  font-bold  uppercase tracking-wider w-10"
                >
                  No
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left  font-bold  uppercase tracking-wider"
                >
                  Waktu Kirim
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left  font-bold  uppercase tracking-wider min-w-[250px]"
                >
                  Pesan (Singkat)
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center  font-bold  uppercase tracking-wider"
                >
                  Lampiran
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left  font-bold  uppercase tracking-wider"
                >
                  Pengirim
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left  font-bold  uppercase tracking-wider"
                >
                  Penerima
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left  font-bold  uppercase tracking-wider"
                >
                  Status Jadwal
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center  font-bold  uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading /* ... (Loading row sama) ... */ && (
                <tr>
                  <td colSpan="8" className="text-center p-5">
                    <div className="flex justify-center items-center text-gray-600">
                      <Loader2 className="animate-spin h-5 w-5 mr-2" /> Memuat
                      data...
                    </div>
                  </td>
                </tr>
              )}
              {!loading &&
                informations.length === 0 /* ... (No data row sama) ... */ && (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center p-5 text-gray-500 italic"
                    >
                      {searchTerm
                        ? "Tidak ada data broadcast yang cocok."
                        : "Belum ada data broadcast."}
                    </td>
                  </tr>
                )}
              {!loading &&
                informations.map((info, index) => (
                  <tr key={info.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-center text-gray-500">
                      {(page - 1) * perPage + index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {formatDateTime(info.waktu_pengiriman) ||
                        info.status_pengiriman}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-800 max-w-xs truncate"
                      title={info.pesan}
                    >
                      {info.pesan}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {info.lampiran ? (
                        <button
                          // --- UBAH onClick DI SINI ---
                          onClick={() =>
                            handleOpenAttachmentModal(info.lampiran)
                          } // Buka modal lampiran
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                          title={`Lihat lampiran: ${info.lampiran}`}
                        >
                          {getFileIcon(info.lampiran)}
                          <span className="hidden sm:inline">Lihat</span>
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {info.pengirim || "Sistem"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {info.tujuan}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          info.status_pengiriman === "Langsung"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {info.status_pengiriman}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {/* Tombol Detail tetap ada */}
                      <button
                        onClick={() => handleOpenDetailModal(info)}
                        className="p-2 text-green-600 hover:text-green-900"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Buttons (Sama) */}
        {!loading &&
          total > 0 &&
          Math.ceil(total / perPage) >
            1 /* ... (Kode pagination sama) ... */ && (
            <div className="mt-5 flex justify-between items-center text-sm">
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

        {/* --- Modals --- */}
        <AddBroadcastModal
          isOpen={addModalOpen}
          onClose={handleCloseAddModal}
          onSubmit={handleAddSubmit}
        />
        <BroadcastDetailModal
          isOpen={detailModalOpen}
          onClose={handleCloseDetailModal}
          data={selectedDetailData}
        />
        {/* Modal Preview Lampiran (BARU) */}
        <AttachmentPreviewModal
          isOpen={attachmentModalOpen}
          onClose={handleCloseAttachmentModal}
          filename={selectedAttachment}
        />
      </div>
    </div>
  );
};

export default KelolaBroadcast;
