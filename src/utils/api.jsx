import axios from "axios";
import { toast } from "react-toastify";

// Buat instance Axios
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Sesuaikan dengan URL backend Anda
  // HAPUS header Content-Type default dari sini
  // headers: {
  //   "Content-Type": "application/json", // <-- HAPUS BARIS INI
  // },
});

// 🔹 Interceptor Request: Tambahkan Token ke Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // PENTING: Jangan set Content-Type di sini jika config.data adalah FormData
    // Biarkan Axios/browser menanganinya secara otomatis untuk FormData
    // Jika Anda perlu MENIMPA Content-Type untuk kasus lain, lakukan dengan hati-hati
    // if (!(config.data instanceof FormData)) {
    //   config.headers['Content-Type'] = 'application/json'; // Hanya jika BUKAN FormData
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔹 Interceptor Response: Tangani Error Secara Global
api.interceptors.response.use(
  (response) => response, // Jika sukses, langsung return response
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Jika sesi habis (Unauthorized), tampilkan toast dan redirect
        toast.error(
          data?.message || "Sesi login habis, silakan login kembali."
        ); // Ambil pesan dari data jika ada
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Beri sedikit delay sebelum redirect agar toast sempat terlihat
        setTimeout(() => {
          window.location.href = "/login"; // Redirect ke halaman login
        }, 1500);
      } else if (status === 403) {
        // Forbidden (tidak punya permission)
        toast.error(
          data?.message || "Anda tidak memiliki izin untuk mengakses fitur ini."
        );
      } else if (status === 422) {
        // Unprocessable Content (Error Validasi)
        // Biarkan komponen yang memanggil API menangani error validasi spesifik
        console.error("Validation Error:", data.errors || data.message);
        // Jangan tampilkan toast umum di sini agar tidak menimpa pesan validasi spesifik
      } else {
        // Jika error lainnya, tampilkan pesan dari server atau pesan default
        toast.error(data?.message || "Terjadi kesalahan pada server.");
      }
    } else if (error.request) {
      // Error koneksi atau tidak ada response dari server
      toast.error(
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
      );
    } else {
      // Error lainnya saat setup request
      toast.error("Terjadi kesalahan saat membuat permintaan.");
    }

    return Promise.reject(error); // Tetap reject error agar bisa ditangani komponen
  }
);

export default api;
