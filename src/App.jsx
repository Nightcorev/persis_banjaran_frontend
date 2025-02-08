import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Home from "./pages/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import DataAnggota from './pages/DataAnggota';
import Statistik from './pages/Statistik';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AdminLayout />}>
      <Route index element={<Home />} />
      <Route path="users/data-anggota" element={<DataAnggota />} />
      <Route path="users/statistik" element={<Statistik />} />
    </Route>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
