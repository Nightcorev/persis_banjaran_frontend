import axios from "axios";
import { toast } from "react-toastify";

// Buat instance Axios
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Sesuaikan dengan URL backend
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Interceptor Request: Tambahkan Token ke Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
        // 🔹 Jika sesi habis (Unauthorized), tampilkan toast dan redirect
        toast.error("Sesi login habis, silakan login kembali.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login"; // Redirect ke halaman login
      } else {
        // 🔹 Jika error lainnya, tampilkan pesan dari server atau pesan default
        toast.error(data.message || "Terjadi kesalahan, silakan coba lagi.");
      }
    } else {
      // 🔹 Jika error karena masalah koneksi
      toast.error("Tidak dapat terhubung ke server.");
    }

    return Promise.reject(error);
  }
);

export default api;
