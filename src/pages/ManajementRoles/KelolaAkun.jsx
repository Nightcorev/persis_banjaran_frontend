import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import api from "../../utils/api";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const KelolaAkun = () => {
  const [akuns, setakun] = useState([]);
  const [roles, setRoles] = useState([]);
  const [anggotas, setAnggota] = useState([]);
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
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedPassword, setSelectedPassword] = useState("");
  const [selectedAnggota, setSelectedAnggota] = useState([]);
  // const [selectedEmail, setSelectedEmail] = useState([]);

  const [editingAkunId, setEditingAkunId] = useState(null);

  useEffect(() => {
    fetchRoles();
    fetchAnggota();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 50);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page, perPage]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`${API_URL}/users`, {
        params: { page, perPage, search: searchTerm },
      });
      setakun(response.data.data.data);
      setTotal(response.data.data.total);
    } catch (error) {
      setError("Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`${API_URL}/roles`);
      setRoles(response.data.data.data);
    } catch (error) {
      setError("Gagal mengambil data, coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnggota = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`${API_URL}/anggota/all`);
      setAnggota(response.data.data);
    } catch (error) {
      setError("Gagal mengambil data, coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`${API_URL}/users/${showModalDelete.id}`);
      toast.success("Delete berhasil dihapus!");
      setShowModalDelete(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting permission:", error);
    }
  };

  const handleRolesChange = (e) => {
    const selectedValue = e.target.value;
    const parsedRole = JSON.parse(selectedValue);
    setSelectedRole([{ id: parsedRole.id }]);
  };

  const handleAnggotaChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedAnggota([
        {
          id: selectedOption.value,
          nama_lengkap: selectedOption.label.split(" (")[0],
          // email: selectedOption.label.split("(")[1]?.replace(")", ""),
        },
      ]);
    }
  };

  const openAddModal = () => {
    setSelectedUsername("");
    setSelectedPassword("");
    // setSelectedEmail("");
    setSelectedAnggota([]);
    setSelectedRole([]);
    setEditingAkunId(null);
    setIsEditMode(false);
    setShowModal(true);
  };

  const openEditModal = (akun) => {
    setSelectedRole([{ id: akun.role.id }]);
    setSelectedUsername(akun.username);
    // setSelectedEmail("");
    setSelectedPassword("");
    setSelectedAnggota([
      {
        id: akun.anggota.id_anggota,
        nama_lengkap: akun.anggota.nama_lengkap,
        // email: akun.anggota.email,
      },
    ]);
    setEditingAkunId(akun.id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRole.length || !selectedRole[0].id) {
      alert("Role harus dipilih!");
      return;
    }

    if (!selectedAnggota.length || !selectedAnggota[0].id) {
      alert("Anggota harus dipilih!");
      return;
    }

    setLoading(true);

    try {
      // let anggotaEmail = selectedAnggota[0].email;
      // if (!anggotaEmail || anggotaEmail === "-") {
      //   anggotaEmail = `${selectedAnggota[0].nama_lengkap
      //     .replace(/\s+/g, "")
      //     .toLowerCase()}@gmail.com`;
      // }
      // let finalEmail = selectedEmail || anggotaEmail;

      const payload = {
        name: selectedAnggota[0].nama_lengkap,
        // email: finalEmail,
        username: selectedUsername,
        password: selectedPassword || undefined,
        role_id: selectedRole[0].id,
        id_anggota: selectedAnggota[0].id,
      };

      if (isEditMode) {
        await api.put(`${API_URL}/users/${editingAkunId}`, payload);
        toast.success("Akun berhasil diperbarui");
      } else {
        await api.post(`${API_URL}/users`, payload);
        toast.success("Akun berhasil ditambahkan");
      }

      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  const anggotaOptions = anggotas.map((anggota) => ({
    value: anggota.id_anggota,
    label: `${anggota.nama_lengkap}`,
    // label: `${anggota.nama_lengkap} (${anggota.email})`,
  }));

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "38px",
      fontSize: "0.875rem",
      "@media (max-width: 640px)": {
        fontSize: "0.75rem",
        minHeight: "32px",
      },
    }),
    option: (provided) => ({
      ...provided,
      fontSize: "0.875rem",
      "@media (max-width: 640px)": {
        fontSize: "0.75rem",
        padding: "6px 12px",
      },
    }),
  };

  return (
    <div className="p-3 sm:p-6 bg-white rounded-lg shadow-lg">
      {/* Header with Add Button - Made responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <h1 className="text-base sm:text-lg font-bold">Kelola Akun</h1>

        <button
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-gray-500 w-full sm:w-auto text-sm sm:text-base"
          onClick={openAddModal}
        >
          + Tambah Akun
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
            placeholder="Cari akun..."
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
                <th className="border p-2">Nama Lengkap</th>
                <th className="border p-2">Username</th>
                {/* <th className="border p-2">Email</th> */}
                <th className="border p-2">Role</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {akuns.length > 0 ? (
                akuns.map((akun, index) => (
                  <tr key={akun.id_akun} className="hover:bg-gray-100">
                    <td className="border p-1.5 sm:p-2 text-center">
                      {(page - 1) * perPage + index + 1}
                    </td>

                    <td className="border p-1.5 sm:p-2">{akun.name}</td>
                    <td className="border p-1.5 sm:p-2 text-center">
                      {akun.username}
                    </td>
                    {/* <td className="border p-1.5 sm:p-2">{akun.email}</td> */}
                    <td className="border p-1.5 sm:p-2 text-center">
                      {akun.role ? akun.role.name_role : "Tidak ada role"}
                    </td>

                    <td className="border p-1.5 sm:p-2 text-center">
                      {/* Action Buttons - Made responsive */}
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center items-center">
                        {/* Edit Button */}
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-yellow-600 flex items-center justify-center w-full sm:w-auto"
                          onClick={() => openEditModal(akun)}
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
                          className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-red-600 flex items-center justify-center w-full sm:w-auto"
                          onClick={() => setShowModalDelete(akun)}
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
                    Tidak ada data akun.
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

      {/* Modal Konfirmasi Hapus - Made responsive */}
      {showModalDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15 p-3">
          <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-xs sm:max-w-md">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Konfirmasi Hapus
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Apakah Anda yakin ingin menghapus akun ini?
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

      {/* Modal Tambah/Edit - Made responsive */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15 p-3">
          <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-xs sm:max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
              {isEditMode ? "Edit Akun" : "Tambah Akun"}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Input Username */}
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <label className="w-full sm:w-1/3 text-start font-medium text-xs sm:text-sm text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full sm:w-2/3 p-1.5 sm:p-2 border rounded text-xs sm:text-sm"
                  placeholder="Input username..."
                  value={selectedUsername}
                  onChange={(e) => setSelectedUsername(e.target.value)}
                  required
                />
              </div>

              {/* Input Email (Edit mode only) */}
              {/* {isEditMode && (
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <label className="w-full sm:w-1/3 text-start font-medium text-xs sm:text-sm text-gray-700">
                    Email
                  </label>
                  <input
                    type="text"
                    className="w-full sm:w-2/3 p-1.5 sm:p-2 border rounded text-xs sm:text-sm"
                    placeholder="Biarkan kosong jika tidak diubah"
                    value={selectedEmail}
                    onChange={(e) => setSelectedEmail(e.target.value)}
                  />
                </div>
              )} */}

              {/* Input Password */}
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <label className="w-full sm:w-1/3 text-start font-medium text-xs sm:text-sm text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full sm:w-2/3 p-1.5 sm:p-2 border rounded text-xs sm:text-sm"
                  placeholder={
                    isEditMode
                      ? "Biarkan kosong jika tidak diubah"
                      : "Input password..."
                  }
                  value={selectedPassword}
                  onChange={(e) => setSelectedPassword(e.target.value)}
                />
              </div>

              {/* Select Role */}
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <label className="w-full sm:w-1/3 text-start font-medium text-xs sm:text-sm text-gray-700">
                  Role
                </label>
                <select
                  className="w-full sm:w-2/3 p-1.5 sm:p-2 border rounded text-xs sm:text-sm"
                  onChange={handleRolesChange}
                  value={
                    selectedRole.length > 0
                      ? JSON.stringify({
                          id: selectedRole[0].id,
                        })
                      : ""
                  }
                >
                  <option value="">Pilih Role</option>
                  {roles.map((role) => (
                    <option
                      key={role.id}
                      value={JSON.stringify({ id: role.id })}
                    >
                      {role.name_role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Anggota dengan Search */}
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <label className="w-full sm:w-1/3 text-start font-medium text-xs sm:text-sm text-gray-700">
                  Anggota
                </label>
                <div className="w-full sm:w-2/3">
                  <Select
                    options={anggotaOptions}
                    onChange={handleAnggotaChange}
                    value={
                      selectedAnggota.length > 0
                        ? {
                            value: selectedAnggota[0].id,
                            label: `${selectedAnggota[0].nama_lengkap}`,
                            // label: `${selectedAnggota[0].nama_lengkap} (${selectedAnggota[0].email})`,
                          }
                        : null
                    }
                    isSearchable
                    placeholder="Cari anggota..."
                    styles={customSelectStyles}
                    className="text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Form Buttons */}
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

export default KelolaAkun;
