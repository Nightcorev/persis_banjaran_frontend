import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../utils/api";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const KelolaPermission = () => {
  const [permissions, setPermissions] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModalDelete, setShowModalDelete] = useState(null);
  const [editingPermission, setEditingPermission] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // State untuk tambah permission
  const [selectedFeature, setSelectedFeature] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showModalAdd, setShowModalAdd] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPermissions();
    }, 50);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page, perPage]);

  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`${API_URL}/permissions`, {
        params: { page, perPage, search: searchTerm },
      });
      setPermissions(response.data.data.data);
      setTotal(response.data.data.total);
    } catch (error) {
      setError("Gagal mengambil data, coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(total / perPage)) {
      setPage(newPage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFeature || !selectedType) {
      toast.error("Lengkapi semua form!");
      return;
    }

    const newPermission = {
      name_permission: `${selectedType}_${selectedFeature}`,
      fitur: selectedFeature,
      jenis_permission: selectedType,
    };

    try {
      await api.post(`${API_URL}/permissions`, newPermission);
      toast.success("Permission berhasil ditambahkan!");
      setShowModalAdd(false);
      setSelectedFeature(""); // Reset
      setSelectedType(""); // Reset
      fetchPermissions();
    } catch (error) {
      console.error("Error adding permission:", error);
    }
  };

  const handleEdit = (permission) => {
    setEditingPermission(permission);
    setSelectedFeature(permission.fitur);
    setSelectedType(permission.jenis_permission);
    setShowModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedFeature || !selectedType) {
      toast.error("Lengkapi semua form!");
      return;
    }
    const newPermission = {
      name_permission: `${selectedType}_${selectedFeature}`,
      fitur: selectedFeature,
      jenis_permission: selectedType,
    };

    try {
      await api.put(
        `${API_URL}/permissions/${editingPermission.id}`,
        newPermission
      );
      toast.success("Permission Berhsil diupdate!");
      setShowModal(false);
      setSelectedFeature(""); // Reset
      setSelectedType(""); // Reset
      fetchPermissions(); // Refresh the permissions list
    } catch (error) {
      toast.error("Failed to update permission");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`${API_URL}/permissions/${showModalDelete.id}`);
      toast.success("Permission berhasil dihapus!");
      setShowModalDelete(null);
      fetchPermissions();
    } catch (error) {
      console.error("Error deleting permission:", error);
    }
  };

  const fiturs = [
    {
      nama_fitur: "Data Anggota",
      value_fitur: "data_anggota",
    },
    {
      nama_fitur: "Data Jamaah",
      value_fitur: "data_jamaah",
    },
  ];

  const jenis = [
    {
      nama_jenis: "Tambah",
      value_jenis: "add",
    },
    {
      nama_jenis: "Index",
      value_jenis: "show",
    },
    {
      nama_jenis: "Edit",
      value_jenis: "edit",
    },
    {
      nama_jenis: "Hapus",
      value_jenis: "delete",
    },
  ];

  return (
    <div className="p-3 sm:p-6 bg-white rounded-lg shadow-lg">
      {/* Header - Made responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <div className="flex items-center">
          <Link
            to="/manageAuth/roles"
            className="p-1.5 sm:p-2 font-bold hover:bg-gray-200 rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
          <h1 className="text-base sm:text-lg font-bold">Kelola Permission</h1>
        </div>
        <button
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-gray-500 w-full sm:w-auto text-sm sm:text-base"
          onClick={() => setShowModalAdd(true)}
        >
          + Tambah Permission
        </button>
      </div>

      {/* Controls for perPage and search - Made responsive */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div className="flex items-center text-xs sm:text-sm">
          <label className="mr-2">Tampilkan:</label>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border p-1.5 sm:p-2 rounded"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="ml-2">data per halaman</span>
        </div>

        {/* Input Pencarian - Made responsive */}
        <div className="flex items-center text-xs sm:text-sm w-full sm:w-auto">
          <label htmlFor="search" className="mr-2">
            Cari:
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari permission..."
            className="border p-1.5 sm:p-2 rounded w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className="flex justify-center items-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-green-500"></div>
          <span className="ml-3 text-gray-600 text-sm sm:text-base">
            Memuat data...
          </span>
        </div>
      )}

      {/* Table Container - Made responsive with overflow-x-auto */}
      {!loading && (
        <div className="overflow-x-auto max-h-[50vh] sm:max-h-[65vh] border rounded-lg text-xs sm:text-sm">
          <table className="table-auto w-full border-collapse border border-gray-300 text-black">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2">Nama Fitur</th>
                <th className="border p-2">Jenis</th>
                <th className="border p-2">Kode Permission</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {permissions.length > 0 ? (
                permissions.map((permission, index) => (
                  <tr key={permission.id} className="hover:bg-gray-100">
                    <td className="border p-1.5 sm:p-2 text-center">
                      {(page - 1) * perPage + index + 1}
                    </td>

                    <td className="border p-1.5 sm:p-2">{permission.fitur}</td>
                    <td className="border p-1.5 sm:p-2">
                      {permission.jenis_permission}
                    </td>
                    <td className="border p-1.5 sm:p-2">
                      {permission.name_permission}
                    </td>

                    <td className="border p-1.5 sm:p-2 text-center">
                      {/* Tombol Edit & Delete - Made responsive */}
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center items-center">
                        {/* Tombol Edit */}
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-yellow-600 flex items-center justify-center w-full sm:w-auto"
                          onClick={() => handleEdit(permission)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-4 h-4 sm:w-5 sm:h-5 mr-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                          <span className="text-xs sm:text-sm">Edit</span>
                        </button>

                        {/* Tombol Delete */}
                        <button
                          className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-red-600 flex items-center justify-center w-full sm:w-auto"
                          onClick={() => setShowModalDelete(permission)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-4 h-4 sm:w-5 sm:h-5 mr-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                          <span className="text-xs sm:text-sm">Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center border p-3 sm:p-4">
                    Tidak ada data permission.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Buttons - Made responsive */}
      <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-300 rounded text-sm sm:text-base disabled:opacity-50"
        >
          ← Prev
        </button>

        <span className="text-xs sm:text-sm">
          Halaman {page} dari {Math.ceil(total / perPage)}
        </span>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= Math.ceil(total / perPage)}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-300 rounded text-sm sm:text-base disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {/* Modal Konfirmasi Hapus - Made responsive */}
      {showModalDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15 p-3">
          <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-xs sm:max-w-md">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Konfirmasi Hapus
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Apakah Anda yakin ingin menghapus permission ini?
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                className="bg-gray-300 text-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm hover:bg-gray-400"
                onClick={() => setShowModalDelete(false)}
              >
                Batal
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm hover:bg-red-600"
                onClick={handleDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Data - Made responsive */}
      {showModalAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15 p-3">
          <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-xs sm:max-w-md">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Tambah Data
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <label className="w-full sm:w-1/4 text-start font-medium text-xs sm:text-sm text-gray-700">
                  Fitur
                </label>
                <select
                  className="w-full sm:w-3/4 p-1.5 sm:p-2 border rounded text-xs sm:text-sm"
                  value={selectedFeature}
                  onChange={(e) => setSelectedFeature(e.target.value)}
                >
                  <option>Pilih Fitur</option>
                  {fiturs.length > 0 ? (
                    fiturs.map((fitur, index) => (
                      <option key={index} value={fitur.value_fitur}>
                        {fitur.nama_fitur}
                      </option>
                    ))
                  ) : (
                    <option value="">Tidak ada Data</option>
                  )}
                </select>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <label className="w-full sm:w-1/4 text-start font-medium text-xs sm:text-sm text-gray-700">
                  Jenis
                </label>
                <select
                  className="w-full sm:w-3/4 p-1.5 sm:p-2 border rounded text-xs sm:text-sm"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">Pilih Jenis Permission</option>
                  {jenis.length > 0 ? (
                    jenis.map((item, index) => (
                      <option key={index} value={item.value_jenis}>
                        {item.nama_jenis}
                      </option>
                    ))
                  ) : (
                    <option value="">Tidak ada Data</option>
                  )}
                </select>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm hover:bg-gray-400"
                  onClick={() => setShowModalAdd(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Data - Made responsive */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15 p-3">
          <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-xs sm:max-w-md">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Edit Data
            </h2>
            <form onSubmit={handleSaveEdit}>
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <label className="w-full sm:w-1/4 text-start font-medium text-xs sm:text-sm text-gray-700">
                  Fitur
                </label>
                <select
                  className="w-full sm:w-3/4 p-1.5 sm:p-2 border rounded text-xs sm:text-sm"
                  value={selectedFeature}
                  onChange={(e) => setSelectedFeature(e.target.value)}
                >
                  <option>Pilih Fitur</option>
                  {fiturs.length > 0 ? (
                    fiturs.map((fitur, index) => (
                      <option key={index} value={fitur.value_fitur}>
                        {fitur.nama_fitur}
                      </option>
                    ))
                  ) : (
                    <option value="">Tidak ada Data</option>
                  )}
                </select>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <label className="w-full sm:w-1/4 text-start font-medium text-xs sm:text-sm text-gray-700">
                  Jenis
                </label>
                <select
                  className="w-full sm:w-3/4 p-1.5 sm:p-2 border rounded text-xs sm:text-sm"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">Pilih Jenis Permission</option>
                  {jenis.length > 0 ? (
                    jenis.map((item, index) => (
                      <option key={index} value={item.value_jenis}>
                        {item.nama_jenis}
                      </option>
                    ))
                  ) : (
                    <option value="">Tidak ada Data</option>
                  )}
                </select>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaPermission;
