import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1 min-h-0">
      <Sidebar isOpen={isSidebarOpen} />

      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className={`
          absolute top-1/2 -translate-y-1/2 z-50 bg-blue-600 text-white px-1 py-3
          rounded-r-md shadow-md transition-all duration-300
          ${isSidebarOpen ? "left-64" : "left-2"}
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          )}
        </svg>
      </button>

        <main className="flex-1 bg-gray-100 p-4 h-full overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
