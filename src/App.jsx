import React, { useEffect } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AuthMiddleware from "./middleware/AuthMiddleware";
import RoleMiddleware from "./middleware/RoleMiddleware";
import { checkTokenExpiry } from "./utils/checkToken";
import Home from "./pages/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import DataAnggota from "./pages/Anggota/DataAnggota";
import AddAnggota from "./pages/Anggota/AddAnggota";
import Statistik from "./pages/Anggota/statistik/ChartStatistic";
import DataPesantren from "./pages/Pendidikan/DataPesantren";
import ErrorPage from "./components/ErrorPage";
import NotFound from "./components/404NotFound";
import DetailDataPesantren from "./pages/Pendidikan/DetailDataPesantren";
import Fasilitas from "./pages/Profil/Fasilitas";
import DataAsatidz from "./pages/Pendidikan/DataAsatidz";
import StatistikPendidikan from "./pages/Pendidikan/StatistikPendidikan";
import DataMonografi from "./pages/Jamiyah/DataMonografi";
import DetailDataAsatidz from "./pages/Pendidikan/DetailDataAsatidz";
import KelolaAkun from "./pages/ManajementRoles/KelolaAkun";
import KelolaPermission from "./pages/ManajementRoles/KelolaPermission";
import KelolaRole from "./pages/ManajementRoles/KelolaRole";
import DetailMonografi from "./pages/Jamiyah/DetailMonografi";
import Login from "./pages/Login";
import Unauthorized from "./components/Unauthorized";
import ViewAnggota from "./pages/Anggota/ViewAnggota";
import MusyawarahDetail from "./pages/Jamiyah/Musyawarah/MusyawarahDetail";
import AddMusyawarah from "./pages/Jamiyah/Musyawarah/AddMusyawarah";
import AddDetailMusyawarah from "./pages/Jamiyah/Musyawarah/AddDetailMusyawarah";
import DataIuran from "./pages/Iuran/PembayaranIuran";
import ReminderIuran from "./pages/Iuran/ReminderIuran";
import KelolaChatbot from "./pages/KelolaChatbot/KelolaChatbot";
import KelolaBroadcast from "./pages/KelolaBroadcast/KelolaBroadcast";
import AddJamaah from "./pages/Jamiyah/Addjamaah";
import RekapIuran from "./pages/Iuran/RekapIuran";
import DataTasykil from "./pages/Profil/DataTasykil";
import AddTasykil from "./pages/Profil/AddTasykil";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Middleware Auth untuk proteksi semua halaman admin */}
      <Route element={<AuthMiddleware />}>
        <Route path="/" element={<AdminLayout />} errorElement={<ErrorPage />}>
          <Route index element={<Home />} />
          <Route path="users/data-anggota" element={<DataAnggota />} />
          <Route
            path="users/data-anggota/add-anggota"
            element={<AddAnggota />}
          />
          <Route
            path="/users/data-anggota/view-anggota/:id"
            element={<ViewAnggota />}
          />
          <Route
            path="/users/data-anggota/edit-anggota/:id"
            element={<AddAnggota />}
          />
          <Route path="users/statistik" element={<Statistik />} />
          <Route path="pendidikan/data-pesantren" element={<DataPesantren />} />
          <Route path="pendidikan/data-asatidz" element={<DataAsatidz />} />
          <Route
            path="pendidikan/statistik"
            element={<StatistikPendidikan />}
          />
          <Route
            path="pendidikan/detail-pesantren"
            element={<DetailDataPesantren />}
          />
          <Route
            path="pendidikan/detail-asatidz"
            element={<DetailDataAsatidz />}
          />
          <Route path="profil/fasilitas" element={<Fasilitas />} />
          <Route path="jamiyah/data-jamiyah" element={<DataMonografi />} />
          <Route path="jamiyah/add-jamiyah" element={<AddJamaah />} />
          <Route path="jamiyah/edit-jamiyah/:id" element={<AddJamaah />} />
          <Route
            path="jamiyah/detail-jamiyah/:id"
            element={<DetailMonografi />}
          />

          {/* Musyawarah Routes */}
          <Route path="/profil/data-tasykil" element={<DataTasykil />} />
          <Route path="/profil/data-tasykil/add-tasykil" element={<AddTasykil />} />
          <Route path="/profil/data-tasykil/edit/:id" element={<AddTasykil />} />
          <Route path="/profil/data-tasykil/detail/:id" element={<MusyawarahDetail />} />
          <Route path="/jamiyah/musyawarah/detail/:id" element={<MusyawarahDetail />} />
          <Route path="jamiyah/detail-jamiyah/data-musyawarah/add-musyawarah" element={<AddMusyawarah/>} />
          <Route path="jamiyah/musyawarah/data-musyawarah/edit-musyawarah/:id" element={<AddMusyawarah/>} />
          <Route path="jamiyah/musyawarah/detail/add/:id" element={<AddDetailMusyawarah/>} />
          <Route path="/jamiyah/musyawarah/detail/edit/:id/:detailId" element={<AddDetailMusyawarah />} />
          
          {/* Iuran Routes */}
          <Route path="iuran/pembayaran" element={<DataIuran />} />
          <Route path="iuran/reminder" element={<ReminderIuran />} />
          <Route path="iuran/rekap" element={<RekapIuran />} />

          {/* Middleware Role: Hanya Super Admin bisa akses halaman ini */}
          <Route element={<RoleMiddleware allowedRoles={["Super Admin"]} />}>
            <Route path="manageAuth/roles" element={<KelolaRole />} />
            <Route path="manageAuth/akun" element={<KelolaAkun />} />
            <Route path="manageAuth/izin" element={<KelolaPermission />} />
          </Route>

          <Route path="/kelola_chatbot" element={<KelolaChatbot />} />
          <Route
            path="/kelola_broadcast_informasi"
            element={<KelolaBroadcast />}
          />

          {/* Menangani 404 Not Found */}
          <Route path="*" element={<NotFound />} />
          <Route path="unauthorized" element={<Unauthorized />} />
        </Route>
      </Route>

      {/* Login Page tanpa Middleware */}
      <Route path="login" element={<Login />} />
    </>
  )
);

const App = () => {
  useEffect(() => {
    checkTokenExpiry();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
