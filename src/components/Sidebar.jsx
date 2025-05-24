import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = ({ isOpen }) => {
  const [isProfilOpen, setIsProfilOpen] = useState(false);
  const [isAnggotaOpen, setIsAnggotaOpen] = useState(false);
  const [isJamiyyahOpen, setIsJamiyyahOpen] = useState(false);
  const [isPendidikanOpen, setIsPendidikanOpen] = useState(false);
  const [isManageAuthOpen, setIsManageAuthOpen] = useState(false);
  const [isIuranOpen, setIsIuranOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const user = JSON.parse(localStorage.getItem("user"));
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];

  const isSuperAdmin = "Super Admin";
  const isBendahara = "Bendahara";
  const isPimpinanJamaah = "Pimpinan Jamaah";

  // Helper function
  const hasPermission = (perm) =>
    user?.role === isSuperAdmin ||
    (Array.isArray(permissions) && permissions.includes(perm));

  const hasAnyPermission = (perms) =>
    user?.role === isSuperAdmin ||
    (Array.isArray(permissions) && perms.some((p) => permissions.includes(p)));

  const hasRole = (roles) =>
    Array.isArray(roles) ? roles.includes(user?.role) : user?.role === roles;

  // Add resize listener for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleProfilMenu = () => {
    setIsProfilOpen(!isProfilOpen);
  };

  const toggleAnggotaMenu = () => {
    setIsAnggotaOpen(!isAnggotaOpen);
  };

  const toggleJamiyyahMenu = () => {
    setIsJamiyyahOpen(!isJamiyyahOpen);
  };

  const toggleManageAuthMenu = () => {
    setIsManageAuthOpen(!isManageAuthOpen);
  };

  const toggleIuranMenu = () => {
    setIsIuranOpen(!isIuranOpen);
  };

  const toggleChatbotMenu = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div
      className={`
        fixed md:fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white 
        transition-all duration-300 z-50 overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="sticky top-0 p-3 text-sm bg-gray-900 z-10">Menu</div>
      <nav className="flex-1 text-sm">
        <ul>
          {/* Menu Dashboard */}
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 p-3 hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 
                  1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 
                  1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              Dashboard
            </Link>
          </li>

          {/* Menu Profil */}
          <li>
            <button
              onClick={toggleProfilMenu}
              className="flex items-center gap-3 p-3 w-full text-left hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944
                 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 
                 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 
                 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 
                 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
              Pimpinan Cabang
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-4 h-4 ml-auto transition-transform ${
                  isProfilOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <ul
              className={`transition-all overflow-hidden duration-300 ease-in-out ${
                isProfilOpen ? "max-h-40" : "max-h-0"
              }`}
            >
              {hasPermission("show_data_tasykil") && (
                <li>
                  <Link
                    to="/profil/data-tasykil"
                    className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                  >
                    Data Tasykil
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/profil/fasilitas"
                  className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                >
                  Fasilitas
                </Link>
              </li>
            </ul>
          </li>

          {/* Menu Anggota  */}
          <li>
            <button
              onClick={toggleAnggotaMenu}
              className="flex items-center gap-3 p-3 w-full text-left hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 
                  20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 
                  0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              Anggota
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-4 h-4 ml-auto transition-transform ${
                  isAnggotaOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <ul
              className={`transition-all overflow-hidden duration-300 ease-in-out ${
                isAnggotaOpen ? "max-h-40" : "max-h-0"
              }`}
            >
              {(hasRole(isPimpinanJamaah) ||
                hasPermission("show_rekap_iuran")) && (
                <li>
                  <Link
                    to="/users/data-anggota"
                    className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                  >
                    Data Anggota
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/users/statistik"
                  className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                >
                  Statistik
                </Link>
              </li>
            </ul>
          </li>

          {/* Menu Jami'yyah */}

          <li>
            <button
              onClick={toggleJamiyyahMenu}
              className="flex items-center gap-3 p-3 w-full text-left hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 
                2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 
                0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 
                8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 
                2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 
                0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 
                0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                />
              </svg>
              Jamaah
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-4 h-4 ml-auto transition-transform ${
                  isJamiyyahOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <ul
              className={`transition-all overflow-hidden duration-300 ease-in-out ${
                isJamiyyahOpen ? "max-h-40" : "max-h-0"
              }`}
            >
              {" "}
              <li>
                <Link
                  to="/jamiyah/data-jamiyah"
                  className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                >
                  Data Jamaah
                </Link>
              </li>
            </ul>
          </li>

          {/* Menu manage data iuran */}
          {(hasRole([isBendahara, isPimpinanJamaah]) ||
            hasAnyPermission(["show_kelola_iuran", "show_rekap_iuran"])) && (
            <li>
              <button
                onClick={toggleIuranMenu}
                className="flex items-center gap-3 p-3 w-full text-left hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                  />
                </svg>
                Iuran Anggota
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-4 h-4 ml-auto transition-transform ${
                    isIuranOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <ul
                className={`transition-all overflow-hidden duration-300 ease-in-out ${
                  isIuranOpen ? "max-h-40" : "max-h-0"
                }`}
              >
                {" "}
                {(hasRole([isBendahara, isPimpinanJamaah]) ||
                  hasPermission("show_kelola_iuran")) && (
                  <li>
                    <Link
                      to="/iuran/pembayaran"
                      className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                    >
                      Kelola Pembayaran Iuran
                    </Link>
                  </li>
                )}
                {(hasRole(isBendahara) ||
                  hasPermission("show_rekap_iuran")) && (
                  <li>
                    <Link
                      to="/iuran/rekap"
                      className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                    >
                      Rekap Iuran
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          )}

          {/* Menu manage data iuran */}
          {hasAnyPermission([
            "show_broadcast_informasi",
            "show_kelola_interaksi_chatbot",
          ]) && (
            <li>
              <button
                onClick={toggleChatbotMenu}
                className="flex items-center gap-3 p-3 w-full text-left hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
                Kelola Chatbot Informasi
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className={`w-4 h-4 ml-auto transition-transform ${
                    isChatbotOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <ul
                className={`transition-all overflow-hidden duration-300 ease-in-out ${
                  isChatbotOpen ? "max-h-40" : "max-h-0"
                }`}
              >
                {hasPermission("show_broadcast_informasi") && (
                  <li>
                    <Link
                      to="/kelola_broadcast_informasi"
                      className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                    >
                      Broadcast Informasi
                    </Link>
                  </li>
                )}
                {hasPermission("show_kelola_interaksi_chatbot") && (
                  <li>
                    <Link
                      to="/kelola_chatbot"
                      className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                    >
                      Dashboard Informasi
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          )}

          {/* Menu manage role dan akun */}
          {hasRole(isSuperAdmin) && (
            <li>
              <button
                onClick={toggleManageAuthMenu}
                className="flex items-center gap-3 p-3 w-full text-left hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
                Kelola Role dan Akun
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-4 h-4 ml-auto transition-transform ${
                    isManageAuthOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <ul
                className={`transition-all overflow-hidden duration-300 ease-in-out ${
                  isManageAuthOpen ? "max-h-40" : "max-h-0"
                }`}
              >
                <li>
                  <Link
                    to="/manageAuth/roles"
                    className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                  >
                    Kelola Roles dan Permission
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manageAuth/akun"
                    className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                  >
                    Kelola Akun
                  </Link>
                </li>
              </ul>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
