import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../utils/api";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const KelolaRole = () => {
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRoles();
      fetchPermissions();
    }, 50);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page, perPage]);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`${API_URL}/roles`, {
        params: { page, perPage, search: searchTerm },
      });
      setRoles(response.data.data.data);
      setTotal(response.data.data.total);
    } catch (error) {
      setError("Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`${API_URL}/permissions`);
      setPermissions(response.data.data.data);
    } catch (error) {
      setError("Gagal mengambil data, coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (e) => {
    const selectedValue = e.target.value;
    if (!selectedValue) return;

    const { id, name_permission } = JSON.parse(selectedValue);

    if (id > 0 && !selectedPermissions.some((perm) => perm.id === id)) {
      setSelectedPermissions([...selectedPermissions, { id, name_permission }]);
    } else {
      console.warn("Invalid permission ID or already added:", id);
    }
  };

  const handleRemovePermission = (id) => {
    setSelectedPermissions((prev) => prev.filter((perm) => perm.id !== id));
  };

  const openAddModal = () => {
    setSelectedRole("");
    setSelectedPermissions([]);
    setEditingRoleId(null);
    setIsEditMode(false);
    setShowModal(true);
  };

  const openEditModal = (role) => {
    setSelectedRole(role.name_role);
    setSelectedPermissions(role.permissions);
    setEditingRoleId(role.id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`${API_URL}/roles/${showModalDelete.id}`);
      toast.success("Role berhasil dihapus!");
      setShowModalDelete(null);
      fetchRoles();
    } catch (error) {
      console.error("Error deleting permission:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      alert("Role harus diisi!");
      return;
    }

    if (selectedPermissions.length === 0) {
      alert("Minimal 1 permission harus dipilih!");
      return;
    }

    try {
      const payload = {
        name_role: selectedRole,
        permissions: selectedPermissions.map((permission) => permission.id),
      };

      if (isEditMode) {
        await api.put(`${API_URL}/roles/${editingRoleId}`, payload);
        toast.success("Role berhasil diperbarui");
      } else {
        await api.post(`${API_URL}/roles`, payload);
        toast.success("Role berhasil ditambahkan");
      }

      setShowModal(false);
      fetchRoles();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-white rounded-lg shadow-lg">
      {/* Header with Add Button - Made responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <h1 className="text-lg font-bold">Kelola Roles</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-sky-600 text-white rounded-lg hover:bg-gray-500 w-full sm:w-auto text-sm sm:text-base">
            <Link to="/manageAuth/izin">Kelola Permission</Link>
          </button>
          <button
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-gray-500 w-full sm:w-auto text-sm sm:text-base"
            onClick={openAddModal}
          >
            + Tambah Roles
          </button>
        </div>
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
            placeholder="Cari role..."
            className="border p-1.5 sm:p-2 rounded w-full"
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
                <th className="border p-2">Nama Roles</th>
                <th className="border p-2">Hak Akses Fitur</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {roles.length > 0 ? (
                roles.map((role, index) => (
                  <tr key={role.id_role} className="hover:bg-gray-100">
                    <td className="border p-1.5 sm:p-2 text-center">
                      {(page - 1) * perPage + index + 1}
                    </td>

                    <td className="border p-1.5 sm:p-2">{role.name_role}</td>
                    <td className="border p-1.5 sm:p-2">
                      {role.permissions.length > 0
                        ? role.permissions
                            .map((p) => p.name_permission)
                            .join(", ")
                        : "-"}
                    </td>

                    <td className="border p-1.5 sm:p-2 text-center">
                      {/* Actions - Made responsive */}
                      <div className="inline-flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center">
                        {/* Edit Button */}
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-yellow-600 flex items-center justify-center"
                          onClick={() => openEditModal(role)}
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

                        {/* Delete Button */}
                        <button
                          className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-red-600 flex items-center justify-center"
                          onClick={() => setShowModalDelete(role)}
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
                    Tidak ada data role.
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
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-300 rounded text-sm sm:text-base disabled:opacity-50"
        >
          ← Prev
        </button>

        <span className="text-xs sm:text-sm">
          Halaman {page} dari {Math.ceil(total / perPage)}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= Math.ceil(total / perPage)}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-300 rounded text-sm sm:text-base disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {/* Delete Confirmation Modal - Made responsive */}
      {showModalDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15 p-3">
          <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-xs sm:max-w-md">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Konfirmasi Hapus
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Apakah Anda yakin ingin menghapus role ini?
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

      {/* Add/Edit Modal - Made responsive */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15 p-3">
          <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
              {isEditMode ? "Edit Role" : "Tambah Role"}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Role input */}
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <label className="w-full sm:w-1/3 text-start font-medium text-xs sm:text-sm text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  className="w-full sm:w-2/3 p-1.5 sm:p-2 border rounded text-sm"
                  placeholder="Input role..."
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
              </div>

              {/* Permission select */}
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <label className="w-full sm:w-1/3 text-start font-medium text-xs sm:text-sm text-gray-700">
                  Permission
                </label>
                <select
                  className="w-full sm:w-2/3 p-1.5 sm:p-2 border rounded text-sm"
                  onChange={handlePermissionChange}
                >
                  <option value="">Pilih Permission</option>
                  {permissions.map((permission) => (
                    <option
                      key={permission.id}
                      value={JSON.stringify({
                        id: permission.id,
                        name_permission: permission.name_permission,
                      })}
                    >
                      {permission.name_permission}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected permissions */}
              {selectedPermissions.length > 0 && (
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-100 rounded">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700">
                    Permission Ditambahkan:
                  </h3>
                  <ul className="mt-2 max-h-40 overflow-y-auto">
                    {selectedPermissions.map((permission) => (
                      <li
                        key={permission.id}
                        className="flex justify-between items-center p-1.5 sm:p-2 bg-white shadow-sm rounded mt-1 text-xs sm:text-sm"
                      >
                        <span className="truncate pr-2">
                          {permission.name_permission}
                        </span>
                        <button
                          type="button"
                          className="bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs rounded hover:bg-red-600 flex-shrink-0"
                          onClick={() => handleRemovePermission(permission.id)}
                        >
                          Hapus
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modal buttons */}
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
                  {isEditMode ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaRole;
