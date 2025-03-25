import { Link } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const [isProfilOpen, setIsProfilOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isJamiyyahOpen, setIsJamiyyahOpen] = useState(false);
  const [isPendidikanOpen, setIsPendidikanOpen] = useState(false);
  const [isManageAuthOpen, setIsManageAuthOpen] = useState(false);

  const toggleProfilMenu = () => {
    setIsProfilOpen(!isProfilOpen);
  };

  const toggleUsersMenu = () => {
    setIsUsersOpen(!isUsersOpen);
  };

  const toggleJamiyyahMenu = () => {
    setIsJamiyyahOpen(!isJamiyyahOpen);
  };

  const togglePendidikanhMenu = () => {
    setIsPendidikanOpen(!isPendidikanOpen);
  };

  const toggleManageAuthMenu = () => {
    setIsManageAuthOpen(!isManageAuthOpen);
  };

  return (
    <div className="w-64 h-full bg-gray-800 text-white flex flex-col overflow-auto">
      <div className="p-3 text-sm bg-gray-900">Menu</div>
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
              Profil
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
              <li>
                <Link
                  to="/profil/tasykil"
                  className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                >
                  Tasykil
                </Link>
              </li>
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

          {/* Menu User  */}
          <li>
            <button
              onClick={toggleUsersMenu}
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
                  isUsersOpen ? "rotate-180" : ""
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
                isUsersOpen ? "max-h-40" : "max-h-0"
              }`}
            >
              <li>
                <Link
                  to="/users/data-anggota"
                  className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                >
                  Data Anggota
                </Link>
              </li>
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
              Jami'yyah
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

          {/* Menu Pendidikan */}
          <li>
            <button
              onClick={togglePendidikanhMenu}
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
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                />
              </svg>
              Pendidikan
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-4 h-4 ml-auto transition-transform ${
                  isPendidikanOpen ? "rotate-180" : ""
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
                isPendidikanOpen ? "max-h-40" : "max-h-0"
              }`}
            >
              <li>
                <Link
                  to="/pendidikan/statistik"
                  className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                >
                  Statistik
                </Link>
              </li>
              <li>
                <Link
                  to="/pendidikan/data-pesantren"
                  className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                >
                  Data Pesanteren
                </Link>
              </li>
              <li>
                <Link
                  to="/pendidikan/data-asatidz"
                  className="block pl-10 p-3 text-gray-300 hover:bg-gray-700"
                >
                  Data Asatidz
                </Link>
              </li>
            </ul>
          </li>

          {/* Menu manage role dan akun */}
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
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
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
