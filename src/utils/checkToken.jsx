import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const checkTokenExpiry = async () => {
  // Mark the function as async
  const expiresAt = localStorage.getItem("expires_at");
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage

  if (expiresAt && new Date(expiresAt) < new Date()) {
    try {
      if (token) {
        // Ensure token exists before making logout API call
        await axios.post(
          `${API_URL}/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` }, // Include 'Bearer' prefix if required
          }
        );
      }
    } catch (error) {
      console.error("Logout gagal:", error);
    }

    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    localStorage.removeItem("role");
    localStorage.removeItem("expires_at");

    // Redirect to login
    window.location.href = "/login";
  }
};
