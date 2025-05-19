import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // Set initial sidebar state based on screen size
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // On resize, only open sidebar automatically on desktop
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    // Initial check
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []); // Keep dependency array empty

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1 min-h-0 relative">
        <Sidebar isOpen={isSidebarOpen} />

        {/* Overlay that appears when sidebar is open on mobile */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className={`
            fixed z-[60] bg-blue-600 hover:bg-blue-700
            text-white p-2 rounded-r-lg shadow-md
            transition-all duration-300 ease-in-out
            flex items-center justify-center
            top-1/2 -translate-y-1/2
            ${isSidebarOpen ? (isMobile ? "left-64" : "left-64") : "left-0"}
          `}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {isSidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            )}
          </svg>
        </button>

        <main
          className={`
            flex-1 bg-gray-100 p-4 h-full overflow-auto transition-all duration-300 ease-in-out
            ${isSidebarOpen ? "md:ml-64" : "ml-0"}
          `}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
