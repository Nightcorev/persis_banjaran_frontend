import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const DetailMusyawarah = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [musyawarah, setMusyawarah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchMusyawarahData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`${API_URL}/detail_musyawarah/${id}`, {
          params: { page, perPage, search: searchTerm },
        });
        const totalData = response.data?.data?.total || 0;
        const fetchedMusyawarah = response.data?.data?.data || [];

        setMusyawarah(fetchedMusyawarah);
        setTotal(totalData);
      } catch (error) {
        console.error("Error fetching musyawarah data:", error);
        setError("Gagal mengambil data musyawarah. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchMusyawarahData();
  }, [page, perPage, searchTerm, id]);

  const handleDelete = async (id_musyawarah, id_detail) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await api.delete(`${API_URL}/musyawarah/detail/${id_musyawarah}/${id_detail}`);
        alert("Data berhasil dihapus.");
        // Refresh data after deletion
        setMusyawarah(prev => 
          prev.map(musyawarah => ({
            ...musyawarah,
            musyawarah_detail: musyawarah.musyawarah_detail.filter(
              detail => detail.id_musyawarah_detail !== id_detail
            )
          }))
        );
      } catch (error) {
        console.error("Error deleting detail musyawarah:", error);
        alert("Gagal menghapus data. Silakan coba lagi.");
      }
    }
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(tanggal).toLocaleDateString("id-ID", options);
  };

  const handleBack = () => {
    // Get the id_master_jamaah from musyawarah data
    const id_master_jamaah = musyawarah[0]?.id_master_jamaah;
    if (id_master_jamaah) {
      navigate(`/jamiyah/detail-jamiyah/${id_master_jamaah}`);
    } else {
      navigate(-1); // Fallback if id_master_jamaah is not available
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 w-full">
        <div className="text-center p-6 md:p-8 bg-white rounded-lg shadow-md">
          <div className="animate-spin h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700">Memuat data musyawarah...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 w-full">
        <div className="text-center p-6 md:p-8 bg-white rounded-lg shadow-md w-full max-w-lg">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <svg className="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
          <Link
            to="/jamiyah/musyawarah/data-musyawarah"
            className="inline-block mt-4 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition"
          >
            Kembali ke Daftar Musyawarah
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen w-full">
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-green-800 p-4 md:p-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-white">Detail Musyawarah</h1>
              <button
                onClick={handleBack}
                className="bg-white text-green-800 px-3 py-1.5 md:px-4 md:py-2 rounded-md hover:bg-green-100 transition flex items-center text-sm md:text-base"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            {musyawarah.length > 0 ? (
              musyawarah.map((item, index) => (
                <div key={item.id_musyawarah || index} className="mb-6 last:mb-0">
                  <div className="bg-green-700 p-3 md:p-4 rounded-t-lg text-white">
                    <h2 className="text-lg md:text-xl font-bold">Musyawarah #{item.id_musyawarah}</h2>
                    <p className="text-xs md:text-sm">{item.master_jamaah?.nama_jamaah || "Tidak ada data nama jamaah"}</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-b-lg divide-y">
                    {/* Display on medium screens and above */}
                    <div className="hidden md:block">
                      {[
                        { label: "Nama Jamaah", value: item.master_jamaah?.nama_jamaah },
                        { label: "Nomor Musyawarah", value: item.id_musyawarah },
                        { label: "Tanggal Pelaksanaan", value: formatTanggal(item.tgl_pelaksanaan) },
                        { label: "Tanggal Akhir Jihad", value: formatTanggal(item.tgl_akhir_jihad) },
                        { 
                          label: "Status", 
                          value: item.aktif ? (
                            <span className="inline-flex items-center px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full">
                              <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 text-sm font-semibold bg-red-100 text-red-800 rounded-full">
                              <span className="w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
                              Tidak Aktif
                            </span>
                          )
                        },
                      ].map((field, i) => (
                        <div key={i} className="grid grid-cols-3 p-4 hover:bg-gray-50">
                          <div className="text-gray-600 font-medium">{field.label}</div>
                          <div className="col-span-2 text-gray-900">
                            {typeof field.value === 'object' ? field.value : field.value || "-"}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Display on small screens */}
                    <div className="md:hidden divide-y">
                      {[
                        { label: "Nama Jamaah", value: item.master_jamaah?.nama_jamaah },
                        { label: "Nomor Musyawarah", value: item.id_musyawarah },
                        { label: "Tanggal Pelaksanaan", value: formatTanggal(item.tgl_pelaksanaan) },
                        { label: "Tanggal Akhir Jihad", value: formatTanggal(item.tgl_akhir_jihad) },
                      ].map((field, i) => (
                        <div key={i} className="p-3 hover:bg-gray-50">
                          <div className="text-gray-600 font-medium text-sm mb-1">{field.label}</div>
                          <div className="text-gray-900">{field.value || "-"}</div>
                        </div>
                      ))}
                      <div className="p-3 hover:bg-gray-50">
                        <div className="text-gray-600 font-medium text-sm mb-1">Status</div>
                        <div>
                          {item.master_jamaah?.aktif ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                              <span className="w-1.5 h-1.5 mr-1 bg-green-500 rounded-full"></span>
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                              <span className="w-1.5 h-1.5 mr-1 bg-red-500 rounded-full"></span>
                              Tidak Aktif
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 md:py-12">
                <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-base md:text-lg font-semibold text-gray-700">Tidak ada data musyawarah</h3>
                <p className="text-gray-500 mt-2 text-sm md:text-base">Tidak ditemukan data musyawarah yang sesuai.</p>
                <Link
                  to="/jamiyah/musyawarah/data-musyawarah"
                  className="inline-block mt-4 md:mt-6 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition"
                >
                  Kembali ke Daftar Musyawarah
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tabel Anggota Musyawarah */}
        {musyawarah.length > 0 && (
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-bold">Daftar Anggota Musyawarah</h1>
              <Link to={`/jamiyah/musyawarah/detail/add/${musyawarah[0]?.id_musyawarah}`}
              state={{ id_master_jamaah: musyawarah[0]?.id_master_jamaah }}>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Tambah Anggota
                </button>
              </Link>
            </div>
            
            {/* Tabel Data */}
            <div className="overflow-x-auto max-h-[65vh] border rounded-lg text-sm">
              <table className="table-auto w-full border-collapse border border-gray-300 text-black">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">No</th>
                    <th className="border p-2">Nomor-SK</th>
                    <th className="border p-2">Nama Anggota</th>
                    <th className="border p-2">Jabatan</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {musyawarah.length > 0 ? (
                    musyawarah.map((anggota, index) => (
                      anggota.musyawarah_detail.map((item, detailIndex) => (
                        <tr key={`${anggota.id}-${detailIndex}`} className="hover:bg-gray-100">
                          <td className="border p-2 text-center">
                            {index + detailIndex + 1}
                          </td>
                          <td className="border p-2 text-center">
                            {item.no_sk || "-"}
                          </td>
                          <td className="border p-2 text-center">
                            {item.anggota?.nama_lengkap || "-"}
                          </td>
                          <td className="border p-2 text-center">
                              {item.jabatan}
                          </td>
                          <td className="border p-2 text-center">
                            <div className="flex justify-center gap-2">
                              {/* Edit Button */}
                              <Link to={`/jamiyah/musyawarah/detail/edit/${anggota.id_musyawarah}/${item.id_musyawarah_detail}`}>
                              <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center justify-center">
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
                              </Link>
                               {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(anggota.id_musyawarah, item.id_musyawarah_detail)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center justify-center"
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
                          </div>
                          </td>
                        </tr>
                      ))
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center border p-4">
                        Tidak ada data anggota musyawarah.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailMusyawarah;