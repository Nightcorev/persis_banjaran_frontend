import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import axios from "axios";

const KelolaBroadcast = () => {
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
  const account = JSON.parse(localStorage.getItem("user"));
  
  const [informations, setInformations] = useState([]);
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    headline: '',
    deskripsi: '',
    tipe_broadcast: '',
    nama_file: null,
    status_pengiriman: '',
    waktu_pengiriman: '',
    tujuan: ''
  });

  const handleFileUpload = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("namaFile", file.name); // Kirim nama file ke server
  
    try {
      const res = await axios.post("http://localhost:3000/upload-attachment", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (res.data.success) {
        setForm((prevForm) => ({
          ...prevForm,
          nama_file: res.data.filename, // Simpan nama file dari respons server
        }));
        console.log("File uploaded:", res.data.url);
      } else {
        alert("Upload gagal");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload gagal");
    }
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
  
    if (name === 'nama_file') {
      await handleFileUpload(files[0]);
    } else if (name === 'status_pengiriman') {
      if (value === 'Langsung') {
        const now = new Date();
        // Offset manual ke UTC+7
        const offsetMs = 7 * 60 * 60 * 1000; // 7 jam dalam milidetik
        const utcPlus7 = new Date(now.getTime() + offsetMs);
        const formattedNow = utcPlus7.toISOString().slice(0, 16); // format untuk input datetime-local
        setForm({ ...form, [name]: value, waktu_pengiriman: formattedNow });
        setForm({ ...form, [name]: value, waktu_pengiriman: formattedNow });
      } else {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  
const handleSubmit = async () => {
    const data = new FormData();
    for (let key in form) {
      data.append(key, form[key]);
    }
    const formDataObj = Object.fromEntries(data.entries());
    console.log(formDataObj);
    setSubmitting(true)
    
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/broadcast', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Sukses:', res.data);
      setSubmitting(false);
      // setModalOpen(false);
    } catch (error) {
      console.error('Gagal:', error);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Memanggil API dengan parameter pencarian dan pagination
        const response = await api.get(
          `/broadcast?page=${page}&perPage=${perPage}&search=${searchTerm}`
        );
        setInformations(response.data.data.data);
        setTotal(response.data.data.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Matikan loading setelah fetch selesai
      }
    };

    fetchData();
  }, [page, perPage, searchTerm]); // Menambahkan searchTerm sebagai dependensi

  const handleDelete = async (id_anggota) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus anggota ini?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/delete_broadcast/${id_anggota}`
      );
      setInformations(informations.filter((information) => information.id_anggota !== id_anggota));
      alert("Data anggota berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Gagal menghapus anggota.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Kelola Informasi Penting</h1>
        {(account?.role === "Super Admin" || permissions.includes("add_data_anggota")) && (
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-gray-500"
            onClick={() => setModalOpen(true)}>
              + Tambah Informasi
            </button>
        )}
      </div>
      {/* Pencarian dan Dropdown untuk memilih perPage */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center text-sm">
          <label className="mr-2">Tampilkan:</label>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border p-2 rounded"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="ml-2">data per halaman</span>
        </div>

        {/* Input Pencarian */}
        <div className="flex items-center text-sm">
          <label htmlFor="search" className="mr-2">
            Cari:
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())} // Update search term on change
            placeholder="Cari informasi..."
            className="border p-2 rounded"
          />
        </div>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className="flex justify-center items-center my-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500"></div>
          <span className="ml-3 text-gray-600">Memuat data...</span>
        </div>
      )}

      {/* Tabel Data */}
      {!loading && (
        <div className="overflow-x-auto max-h-[65vh] border rounded-lg text-sm">
          <table className="table-auto w-full border-collapse border border-gray-300 text-black">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2">Waktu Pengiriman</th>
                <th className="border p-2">Pesan</th>
                <th className="border p-2">Lampiran</th>
                <th className="border p-2">Pengirim</th>
                <th className="border p-2">Penerima</th>
                <th className="border p-2">Status Jadwal</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {informations.length > 0 ? (
                informations.map((information, index) => (
                  <tr key={information.id_anggota} className="hover:bg-gray-100">
                    <td className="border p-2 text-center">
                      {(page - 1) * perPage + index + 1}
                    </td>
                    <td className="border p-2 text-center">{information.waktu_pengiriman}</td>
                    <td className="border p-2">{information.deskripsi}</td>
                    <td className="border p-2">
                      {information.nama_file ? (
                        <button
                        className="text-blue-500 underline"
                        onClick={() => {
                          setSelectedAttachment(information.nama_file);
                          setAttachmentModalOpen(true);
                        }}
                      >
                        {information.nama_file}
                      </button>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="border p-2">belum implemen</td>
                    <td className="border p-2">{information.tujuan}</td>
                    <td className="border p-2">{information.status_pengiriman}</td>
                    <td className="border p-2 text-center space-x-2">
                      <a
                        href={`/informations/data-anggota/view-anggota/${information.id_anggota}`}
                      >
                        <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-blue-600 items-center justify-centers">
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
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </button>
                      </a>

                      {(account?.role === "Super Admin" ||
                        permissions.includes("edit_data_anggota")) && (
                        <a
                          href={`/informations/data-anggota/edit-anggota/${information.id_anggota}`}
                        >
                          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 items-center justify-centers">
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
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                          </button>
                        </a>
                      )}
                      {(account?.role === "Super Admin" ||
                        permissions.includes("delete_data_anggota")) && (
                        <button
                          onClick={() => handleDelete(information.id_anggota)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 items-center justify-centers"
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
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center border p-4">
                    Tidak ada data informasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Buttons */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Halaman {page} dari {Math.ceil(total / perPage)}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= Math.ceil(total / perPage)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-[90%] max-w-xl shadow-lg">
          <h2 className="text-xl mb-4 font-semibold text-center">Tambah Broadcast</h2>
      
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-1 font-medium">Penerima</label>
              <select
                name="tujuan"
                className="border rounded px-4 py-2 w-full"
                onChange={handleChange}
                value={form.tujuan}
              >
                <option value="">-- Silahkan Pilih --</option>
                <option value="semua">Semua</option>
                <option value="PJ">PJ</option>
                <option value="anggota per PJ">Anggota per PJ</option>
                <option value="test">Test</option>
              </select>
            </div>

            {/* <div>
              <label className="block mb-1 font-medium">Headline</label>
              <input
                name="headline"
                placeholder="Masukkan headline"
                className="border rounded px-4 py-2 w-full"
                onChange={handleChange}
              />
            </div> */}
      
            <div>
              <label className="block mb-1 font-medium">Pesan</label>
              <textarea
                name="deskripsi"
                placeholder="Masukkan deskripsi"
                className="border rounded px-4 py-2 w-full"
                onChange={handleChange}
              ></textarea>
            </div>
      
            {/* <div>
              <label className="block mb-1 font-medium">Tipe Broadcast</label>
              <select
                name="tipe_broadcast"
                className="border rounded px-4 py-2 w-full"
                onChange={handleChange}
                value={form.tipe_broadcast}
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="document">Document</option>
              </select>
            </div> */}
      
            <div>
              <label className="block mb-1 font-medium">Status Pengiriman</label>
              <select
                name="status_pengiriman"
                className="border rounded px-4 py-2 w-full"
                onChange={handleChange}
                value={form.status_pengiriman}
              >
                <option value="">-- Silahkan Pilih --</option>
                <option value="Langsung">Langsung</option>
                <option value="Terjadwal">Terjadwal</option>
              </select>
            </div>
      
            <div>
              <label className="block mb-1 font-medium">Waktu Pengiriman</label>
              <input
                type="datetime-local"
                className="border rounded px-4 py-2 w-full"
                name="waktu_pengiriman"
                value={form.waktu_pengiriman}
                onChange={handleChange}
                disabled={form.status_pengiriman === 'Langsung'}
              />
            </div>
          </div>

          <div>
              <label className="block mb-1 font-medium">Lampiran</label>
              <input
                type="file"
                name="nama_file"
                className="border rounded px-4 py-2 w-full"
                onChange={handleChange}
              />
            </div>
      
          <div className="flex justify-end mt-6 gap-2">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              onClick={() => setModalOpen(false)}
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center disabled:opacity-50"
              disabled={submitting}
            >
              {submitting && (
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
              )}
              {submitting ? '' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
      )}

      {attachmentModalOpen && selectedAttachment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setAttachmentModalOpen(false)}
            >
              x
            </button>
            <h2 className="text-lg font-semibold mb-4">Lampiran</h2>
            {selectedAttachment.endsWith(".pdf") ? (
              <iframe
                src={`http://localhost:3000/public/uploads/broadcast/${selectedAttachment}`}
                className="w-full h-[500px]"
                title="PDF Lampiran"
              />
            ) : (
              <img
                src={`http://localhost:3000/public/uploads/broadcast/${selectedAttachment}`}
                alt="Lampiran"
                className="w-full max-h-[500px] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaBroadcast;
