import React, { useState, useEffect } from "react";
import axios from "axios";
import { UAParser } from "ua-parser-js";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;
import backgroundImage from "../assets/bekron.jpg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [deviceInfo, setDeviceInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("https://api64.ipify.org?format=json")
      .then((response) => setIpAddress(response.data.ip))
      .catch((error) => console.error("Gagal mengambil IP:", error));

    const parser = new UAParser();
    const deviceData = parser.getResult();
    const deviceStr = `${deviceData.browser.name} on ${deviceData.os.name} (${
      deviceData.device.type || "Desktop"
    })`;

    setDeviceInfo(deviceStr);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
        ip_address: ipAddress,
        device_info: deviceInfo,
      });

      const { token, user, permissions, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("permissions", JSON.stringify(permissions));
      localStorage.setItem("role", role);

      toast.success("Login Berhasil!");
      window.location.href = "/";
    } catch (error) {
      alert(error.response?.data?.message || "Login gagal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Overlay untuk efek gelap */}
      <div className="absolute inset-0 bg-black  bg-opacity-20"></div>

      {/* Form Login di Tengah */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white p-8 rounded-lg shadow-lg bg-opacity-90">
        <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          Sign in to access your account
        </p>

        <form onSubmit={handleLogin} className="mt-6">
          <div>
            <label className="block text-sm text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Input Username.."
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Input Password.."
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div className="mt-6">
            <button
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
