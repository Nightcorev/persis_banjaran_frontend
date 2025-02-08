import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import DataAnggota from "./pages/Anggota/DataAnggota";
import Statistik from "./pages/Anggota/Statistik";
import DataPesantren from "./pages/Pendidikan/DataPesantren";
import ErrorPage from "./components/ErrorPage"; // Komponen untuk menangani error
import NotFound from "./components/404NotFound"; // Komponen untuk halaman 404
import DetailDataPesantren from "./pages/Pendidikan/DetailDataPesantren";
import Tasykil from "./pages/Profil/Tasykil";
import Fasilitas from "./pages/Profil/Fasilitas";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AdminLayout />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="users/data-anggota" element={<DataAnggota />} />
      <Route path="users/statistik" element={<Statistik />} />
      <Route path="pendidikan/data-pesantren" element={<DataPesantren />} />
      <Route
        path="pendidikan/detail-pesantren"
        element={<DetailDataPesantren />}
      />
      <Route path="profil/tasykil" element={<Tasykil />} />
      <Route path="profil/fasilitas" element={<Fasilitas />} />
      {/* Menangani 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
