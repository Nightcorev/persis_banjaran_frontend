import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // Import CSS untuk toast notifications
import { ToastContainer } from "react-toastify";
import Home from "./pages/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import DataAnggota from "./pages/Anggota/DataAnggota";
import AddAnggota from "./pages/Anggota/AddAnggota";
import Statistik from "./pages/Anggota/Statistik";
import DataPesantren from "./pages/Pendidikan/DataPesantren";
import ErrorPage from "./components/ErrorPage"; // Komponen untuk menangani error
import NotFound from "./components/404NotFound"; // Komponen untuk halaman 404
import DetailDataPesantren from "./pages/Pendidikan/DetailDataPesantren";
import Tasykil from "./pages/Profil/Tasykil";
import Fasilitas from "./pages/Profil/Fasilitas";
import DataAsatidz from "./pages/Pendidikan/DataAsatidz";
import StatistikPendidikan from "./pages/Pendidikan/StatistikPendidikan";
import DataMonografi from "./pages/Jamiyah/DataMonografi";
import DetailDataAsatidz from "./pages/Pendidikan/DetailDataAsatidz";
import KelolaAkun from "./pages/ManajementRoles/KelolaAkun";
import KelolaPermission from "./pages/ManajementRoles/KelolaPermission";
import KelolaRole from "./pages/ManajementRoles/KelolaRole";
import DetailMonografi from "./pages/Jamiyah/DetailMonografi";
import ViewAnggota from "./pages/Anggota/ViewAnggota";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AdminLayout />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="users/data-anggota" element={<DataAnggota />} />
      <Route path="/users/data-anggota/add-anggota" element={<AddAnggota />} />
      <Route path="/users/data-anggota/view-anggota/:id" element={<ViewAnggota />} />
      <Route path="/users/data-anggota/edit-anggota/:id" element={<AddAnggota />} />
      <Route path="users/statistik" element={<Statistik />} />
      <Route path="pendidikan/data-pesantren" element={<DataPesantren />} />
      <Route path="pendidikan/data-asatidz" element={<DataAsatidz />} />
      <Route path="pendidikan/statistik" element={<StatistikPendidikan />} />
      <Route
        path="pendidikan/detail-pesantren"
        element={<DetailDataPesantren />}
      />
      <Route path="pendidikan/detail-asatidz" element={<DetailDataAsatidz />} />
      <Route path="profil/tasykil" element={<Tasykil />} />
      <Route path="profil/fasilitas" element={<Fasilitas />} />
      <Route path="jamiyah/data-jamiyah" element={<DataMonografi />} />
      <Route path="/jamiyah/detail-jamiyah/:id" element={<DetailMonografi />} />
      <Route path="manageAuth/roles" element={<KelolaRole />} />
      <Route path="manageAuth/akun" element={<KelolaAkun />} />
      <Route path="manageAuth/izin" element={<KelolaPermission />} />
      {/* Menangani 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer /> {/* Tempatkan ToastContainer di luar RouterProvider */}
    </>
  );
};
export default App;
