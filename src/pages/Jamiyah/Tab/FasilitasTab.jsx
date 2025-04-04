import { useState, useEffect } from "react";
import api from "../../../utils/api";


const API_URL = import.meta.env.VITE_API_BASE_URL;

const FasilitasTab = ({ masterJamaahId = null}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [fasilitasData, setFasilitasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchJamaahData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`${API_URL}/fasilitas/by-jamaah/${masterJamaahId}`, {
          params: { perPage, search: searchTerm },
        });
        const fasilitasArray = response.data?.data?.data || [];
        setFasilitasData(fasilitasArray);
      } catch (error) {
        console.error("Error fetching jamaah data:", error);
        setError("Gagal mengambil data fasilitas. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (masterJamaahId) {
      fetchJamaahData();
    }
  }, [masterJamaahId, searchTerm, perPage]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Data Fasilitas</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : fasilitasData.length === 0 ? (
        <p>Tidak ada data fasilitas tersedia.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {fasilitasData.map((fasilitas) => (
            <div key={fasilitas.id_fasilitas} className="bg-white shadow rounded-lg p-4">
              <p className="mb-2">{fasilitas.deskripsi}</p>
              <img
                src={`/media/images/fasilitas/${fasilitas.foto}`}
                alt={fasilitas.deskripsi}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FasilitasTab;
