import React, { useState, useEffect } from "react";
import api from "../../../utils/api";

const MusyawarahTab = ({ jamaahId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jamaahData, setJamaahData] = useState(null);

  useEffect(() => {
    const fetchJamaahData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/jamaah-monografi/${jamaahId}`);
        setJamaahData(response.data.data);
      } catch (error) {
        console.error("Error fetching jamaah data:", error);
        setError("Gagal mengambil data jamaah. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (jamaahId) {
      fetchJamaahData();
    }
  }, [jamaahId]);

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(tanggal).toLocaleDateString("id-ID", options);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Data Musyawarah</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">No</th>
              <th className="border p-2">Tanggal Musjam</th>
              <th className="border p-2">Masa Akhir Jihad</th>
              <th className="border p-2">Ketua Terpilih</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Memuat data...
                </td>
              </tr>
            ) : jamaahData?.musyawarah?.length > 0 ? (
              jamaahData.musyawarah.map((musyawarah, index) => {
                const ketuaDetail = musyawarah.musyawarah_detail.find(
                  (detail) => detail.jabatan === "Ketua"
                );
                return (
                  <tr key={musyawarah.id_musyawarah}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2 text-center">
                      {formatTanggal(musyawarah.tgl_pelaksanaan)}
                    </td>
                    <td className="border p-2 text-center">
                      {formatTanggal(musyawarah.tgl_akhir_jihad)}
                    </td>
                    <td className="border p-2">
                      {ketuaDetail?.anggota?.nama_lengkap || "-"}
                    </td>
                    <td className="border p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          musyawarah.aktif
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {musyawarah.aktif ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Tidak ada data musyawarah.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MusyawarahTab;
