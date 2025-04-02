import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const Header = () => {
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: { Authorization: token },
        }
      );
    } catch (error) {
      console.error("Logout gagal:", error);
    }

    // Hapus data user dari localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    localStorage.removeItem("role");

    window.location.href = "/login";
  };

  return (
    <header
      className="bg-emerald-800 flex items-center justify-between p-4"
      style={{ height: "60px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
    >
      <a
        href="/"
        className="flex items-center text-white text-lg font-bold"
        style={{ textDecoration: "none" }}
      >
        <img
          src="https://profil.persisbanjaran.org/media/images/logo.png"
          alt="Logo Persis Banjaran"
          style={{ height: "40px", marginRight: "10px" }}
        />
        Persis Banjaran
      </a>

      <nav>
        <ul className="flex space-x-4">
          <li>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-gray-500"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
