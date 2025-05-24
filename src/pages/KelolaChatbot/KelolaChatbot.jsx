import React, { useState, useCallback, useEffect } from "react"; // Tambah useEffect
import { Plus, Edit, Trash2, X } from "lucide-react";
import api from "../../utils/api"; // Import instance Axios Anda
import { toast } from "react-toastify"; // Import toast

// --- Komponen Modal (Tetap sama seperti sebelumnya) ---
function ChatbotModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const isEditMode = Boolean(initialData);
  const [pesan, setPesan] = useState("");
  const [jawaban, setJawaban] = useState("");

  React.useEffect(() => {
    if (isOpen && isEditMode) {
      setPesan(initialData.pesan || ""); // Sesuaikan dengan nama field dari backend
      setJawaban(initialData.jawaban || "");
    } else if (isOpen) {
      setPesan("");
      setJawaban("");
    }
  }, [isOpen, initialData, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pesan || !jawaban) {
      alert("Pertanyaan/Keyword dan Jawaban tidak boleh kosong.");
      return;
    }
    // Kirim data termasuk ID jika edit
    const dataToSend = {
      id: isEditMode ? initialData.id : undefined, // Sertakan ID hanya saat edit
      pesan: pesan, // Sesuaikan nama field
      jawaban: jawaban,
    };
    onSubmit(dataToSend);
    // onClose(); // Biarkan onSubmit yg menutup modal setelah sukses API call
  };

  if (!isOpen) return null;

  const modalTitle = isEditMode ? "Edit Item Chatbot" : "Tambah Item Chatbot";
  const pesanLabel = "Pertanyaan/Keyword";
  const jawabanLabel = "Jawaban Chatbot";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="pesan"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {pesanLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="pesan"
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="jawaban"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {jawabanLabel} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="jawaban"
              rows="4"
              value={jawaban}
              onChange={(e) => setJawaban(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Komponen Utama Halaman ---
export default function KelolaChatbot() {
  // --- State ---
  const [chatbotItems, setChatbotItems] = useState([]); // Mulai kosong, ambil dari API
  const [loading, setLoading] = useState(true); // State loading
  const [error, setError] = useState(null); // State error
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItemData, setCurrentItemData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  // State untuk pagination (jika API menggunakannya)
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  // --- Fungsi Fetch Data ---
  const fetchChatbotItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Ganti URL jika berbeda, tambahkan parameter pagination jika perlu
      const response = await api.get("/chatbot"); // Panggil GET /api/chatbot
      // Sesuaikan jika menggunakan pagination
      setChatbotItems(response.data.data || response.data); // Ambil data dari response
      // Jika pakai pagination:
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal memuat data chatbot.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Fetch Chatbot Error:", err);
    } finally {
      setLoading(false);
    }
  }, []); // Tambahkan dependensi jika ada (misal: page)

  // Ambil data saat komponen dimuat
  useEffect(() => {
    fetchChatbotItems();
  }, [fetchChatbotItems]);

  // --- Fungsi CRUD (dengan API Calls) ---

  const openModal = useCallback((itemData = null) => {
    setCurrentItemData(itemData);
    setIsEditMode(Boolean(itemData));
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentItemData(null);
    setIsEditMode(false);
  }, []);

  const handleModalSubmit = useCallback(
    async (formData) => {
      // formData sudah berisi { id?, pertanyaan, jawaban }
      setLoading(true); // Tampilkan loading saat proses API

      try {
        if (isEditMode) {
          // Panggil API Update (PUT /chatbot/{id})
          await api.put(`/chatbot/${formData.id}`, {
            pesan: formData.pesan,
            jawaban: formData.jawaban,
          });
          toast.success("Item chatbot berhasil diperbarui!");
        } else {
          // Panggil API Create (POST /chatbot)
          await api.post("/chatbot", {
            pesan: formData.pesan,
            jawaban: formData.jawaban,
          });

          toast.success("Item chatbot berhasil ditambahkan!");
        }
        closeModal(); // Tutup modal setelah sukses
        fetchChatbotItems(); // Ambil data terbaru
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          `Gagal ${isEditMode ? "memperbarui" : "menambahkan"} item.`;
        toast.error(errorMessage);
        console.error("Submit Chatbot Error:", err);
        setLoading(false); // Matikan loading jika error
      }
      // setLoading(false) akan dijalankan di fetchChatbotItems jika sukses
    },
    [isEditMode, fetchChatbotItems, closeModal]
  );

  const handleDeleteItem = useCallback(
    async (itemId) => {
      if (
        window.confirm("Apakah Anda yakin ingin menghapus item chatbot ini?")
      ) {
        setLoading(true); // Tampilkan loading
        try {
          // Panggil API Delete (DELETE /chatbot/{id})
          await api.delete(`/chatbot/${itemId}`);
          console.log(itemId)
          toast.success("Item berhasil dihapus.");
          fetchChatbotItems(); // Ambil data terbaru
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || "Gagal menghapus item.";
          toast.error(errorMessage);
          console.error("Delete Chatbot Error:", err);
          setLoading(false); // Matikan loading jika error
        }
      }
    },
    [fetchChatbotItems]
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto bg-white p-5 sm:p-6 rounded-lg shadow-md">
        {/* Header Halaman */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">
            Kelola Interaksi Chatbot
          </h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm shadow-sm"
            disabled={loading} // Disable saat loading
          >
            <Plus size={18} /> Tambah Item Chatbot
          </button>
        </div>

        {/* Alert Error */}
        {error && !loading && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300 text-sm">
            {error}{" "}
            <button
              onClick={fetchChatbotItems}
              className="ml-2 font-semibold underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Tampilan Loading */}
        {loading && (
          <div className="text-center py-10">
            <div className="flex justify-center items-center text-gray-600">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5"
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
          </div>
        )}

        {/* Daftar Item Chatbot */}
        {/* Daftar Item Chatbot */}
        {!loading && !error && (
          <div className="space-y-3">
            {chatbotItems.length === 0 && (
              <p className="text-center text-gray-500 italic py-6">
                Belum ada item chatbot. Silakan tambahkan item baru.
              </p>
            )}
            {chatbotItems.map((item, index) => (
              <div
                key={item.id}
                className="p-2 border border-gray-200 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="grid grid-cols-12 gap-1 items-start">
                  {/* Nomor */}
                  <div className="col-span-1 flex justify-center items-center text-center text-3xl font-semibold text-gray-700 h-full">
                    <div className="flex items-center justify-center h-full">
                      {index + 1}.
                    </div>
                  </div>
                  {/* Pesan dan Jawaban */}
                  <div className="col-span-10 space-y-2">
                    <div className="text-gray-800 break-words">
                      <span className="font-semibold text-blue-700">P:</span>{" "}
                      {item.pesan}
                    </div>
                    <div className="text-gray-600 break-words">
                      <span className="font-semibold text-green-700">J:</span>{" "}
                      {item.jawaban}
                    </div>
                  </div>
                  {/* Aksi */}
                  <div className="col-span-1 flex flex-col items-center space-y-2">
                    <button
                      onClick={() => openModal(item)}
                      className="p-1 text-yellow-600 hover:text-yellow-800"
                      title="Edit Item"
                      disabled={loading} // Disable saat loading
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Hapus Item"
                      disabled={loading} // Disable saat loading
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && pagination.last_page > 1 && (
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={pagination.current_page === 1}
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span>
              Halaman {pagination.current_page} dari{" "}
              {Math.ceil(pagination.total / pagination.per_page)}
            </span>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={
                pagination.current_page >=
                Math.ceil(pagination.total / pagination.per_page)
              }
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal Form */}
      <ChatbotModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        initialData={currentItemData}
      />
    </div>
  );
}
