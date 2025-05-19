import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
import api from "../../../utils/api";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Trash2
} from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SetBounds = ({ markers }) => {
  const map = useMap();
  
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(
        markers.map(marker => [marker.lokasi_lat, marker.lokasi_long])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);

  return null;
};


const AdvancedStatistic = () => {
  const [open, setOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState({});
  const [formData, setFormData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [detailAnggota, setDetailAnggota] = useState([]);
  const [selectedJamaah, setSelectedJamaah] = useState("semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  const fieldAnggota = [
    { key: "master_otonom", label: "Otonom", type: "select", optionsKey: "master_otonom", optionValue: "id_otonom", optionLabel: "nama_otonom" },
    { key: "status_aktif", label: "Status Aktif", type: "select", optionsKey: "status_aktif", optionValue: "value", optionLabel: "label" },
    { key: "status_merital", label: "Status Merital", type: "select", optionsKey: "status_merital", optionValue: "value", optionLabel: "label" },
    { key: "tempat_lahir", label: "Tempat Lahir", type: "text" },
    { key: "kelahiran_tahun", label: "Tahun Kelahiran", type: "number" },
    { key: "tahun_haji", label: "Tahun Haji", type: "number" },
  ];

  const fieldKeluarga = [
    { key: "tanggungan", label: "Jumlah Tanggungan", type: "select", optionsKey: "tanggungan", optionValue: "value", optionLabel: "label" },
    { key: "istri_persistri", label: "Istri Persistri", type: "select", optionsKey: "istri_persistri", optionValue: "value", optionLabel: "label"},
    { key: "jumlah_anak", label: "Jumlah Anak", type: "number" },
    { key: "jumlah_anak_pemuda", label: "Anak Pemuda", type: "number" },
    { key: "jumlah_anak_pemudi", label: "Anak Pemudi", type: "number" },
    { key: "kepemilikan_rumah", label: "Kepemilikan Rumah", type: "select", optionsKey: "kepemilikan_rumah", optionValue: "value", optionLabel: "label" },
  ];
  
  const fieldPendidikan = [
    { key: "pendidikan", label: "Pendidikan", type: "select", optionsKey: "pendidikan", optionValue: "id_tingkat_pendidikan", optionLabel: "pendidikan" },
    { key: "nama_sekolah", label: "Nama Sekolah", type: "text" },
    { key: "jurusan", label: "Jurusan", type: "text" },
    { key: "tahun_masuk", label: "Tahun Masuk", type: "number" },
    { key: "tahun_lulus", label: "Tahun Lulus", type: "number" },
  ];

  const fieldPekerjaan = [
    { key: "pekerjaan", label: "Pekerjaan", type: "select", optionsKey: "pekerjaan", optionValue: "id_master_pekerjaan", optionLabel: "nama_pekerjaan" },
    { key: "pekerjaan_lainnya", label: "Pekerjaan Lainnya", type: "text" },
    { key: "nama_perusahaan", label: "Nama Perusahaan", type: "text" },
    { key: "pendapatan", label: "Pendapatan", type: "select", optionsKey: "pendapatan", optionValue: "value", optionLabel: "label" },
  ];

  const fieldKeterampilan = [
    { key: "keterampilan", label: "Keterampilan", type: "select", optionsKey: "keterampilan", optionValue: "id_master_keterampilan", optionLabel: "nama_keterampilan" },
    { key: "keterampilan_lainnya", label: "Keterampilan Lainnya", type: "text" },
  ];

  const fieldMinat = [
    { key: "minat", label: "Minat", type: "select", optionsKey: "minat", optionValue: "id_master_minat", optionLabel: "nama_minat" },
    { key: "minat_lainnya", label: "Minat Lainnya", type: "text" },
  ];

  useEffect(() => {
    api.get("/data_choice_advanced_statistic")
      .then((response) => {
        setOptions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
        // Error akan otomatis ditangani oleh interceptor axios Anda
        // Tidak perlu menampilkan toast di sini karena sudah dihandle interceptor
      });
  }, []);

  const handleCheckboxChange = (field) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearAll = () => {
      // Clear all checkboxes
      setSelectedFields({});
      // Clear all input fields
      setFormData({});
    };

  const handleSave = async () => {
    console.log(formData)
    // Membuat query params dari formData
    const params = {};
    
    // Menambahkan hanya field yang memiliki nilai
    Object.entries(formData).forEach(([key, value]) => {
      if (selectedFields[key] && value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });

    try {
      // Menggunakan api utility yang sudah di-configure
      const response = await api.get('/advanced_statistic', {
        params: params // Axios akan otomatis menangani query params
      });

      setChartData(response.data.statistics);
      setDetailAnggota(response.data.detail_anggota || []);
      setOpen(false);
      console.log('Success:', response.data.detail_anggota);
    } catch (error) {
      // Error sudah ditangani oleh interceptor, jadi tidak perlu menampilkan lagi
      console.error('Error:', error);
      // Jika Anda ingin menangani error secara spesifik di sini, Anda bisa:
      // if (axios.isAxiosError(error)) {
      //   console.log('Error response:', error.response?.data);
      // }
    }
  };

  const renderField = (field) => {
    if (field.type === "select" && options[field.optionsKey]) {
      return (
        <select
          className="border p-2 rounded w-full"
          value={formData[field.key] || ""}
          onChange={(e) => handleInputChange(field.key, e.target.value)}
        >
          <option value="">Pilih {field.label}</option>
          {options[field.optionsKey].map((option) => (
            <option key={option[field.optionValue]} value={option[field.optionValue]}>
              {option[field.optionLabel]}
            </option>
          ))}
        </select>
      );
    }
    
    return (
      <input
        type={field.type}
        className="border p-2 rounded w-full"
        value={formData[field.key] || ""}
        onChange={(e) => handleInputChange(field.key, e.target.value)}
      />
    );
  };

  const renderFieldGroup = (fields, title) => {
    return (
      <div>
        <h3 className="font-semibold text-blue-700 mb-2 border-b pb-1">{title}</h3>
        <div className="grid grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!selectedFields[field.key]}
                  onChange={() => handleCheckboxChange(field.key)}
                />
                {field.label}
              </label>
              {selectedFields[field.key] && renderField(field)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const barData = {
    labels: chartData.map((item) => item.nama_jamaah),
    datasets: [
      {
        label: "Jumlah Anggota",
        data: chartData.map((item) => item.jumlah_anggota),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: chartData.map((item) => item.nama_jamaah),
    datasets: [
      {
        data: chartData.map((item) => item.jumlah_anggota),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const calculateQuartiles = (data) => {
    const values = data.map(item => item.jumlah_anggota).sort((a, b) => a - b);
    const n = values.length;
    
    const Q1 = values[Math.floor(0.25 * (n + 1)) - 1];
    const Q2 = values[Math.floor(0.5 * (n + 1)) - 1];
    const Q3 = values[Math.floor(0.75 * (n + 1)) - 1];
    
    return { Q1, Q2, Q3 };
  };

  const getLevelAndColor = (value, quartiles) => {
    if (value <= quartiles.Q1) return { level: 1, color: 'green' };
    if (value <= quartiles.Q2) return { level: 2, color: 'blue' };
    if (value <= quartiles.Q3) return { level: 3, color: 'orange' };
    return { level: 4, color: 'red' };
  }
  
  const quartiles = chartData.length > 0 ? calculateQuartiles(chartData) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <button 
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-gray-500" 
        onClick={() => setOpen(true)}
      >
        Isi Data
      </button>
      
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[60vw] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Isi Data</h2>
            <div className="mt-4 flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-gray-300 rounded" 
                onClick={handleClearAll}
              > <Trash2 /> </button>
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setOpen(false)}>
                Batal
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSave}>
                Simpan
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {renderFieldGroup(fieldAnggota, "Data Anggota")}
              {renderFieldGroup(fieldKeluarga, "Data Keluarga")}
              {renderFieldGroup(fieldPendidikan, "Data Pendidikan")}
              {renderFieldGroup(fieldPekerjaan, "Data Pekerjaan")}
              {renderFieldGroup(fieldKeterampilan, "Data Keterampilan")}
              {renderFieldGroup(fieldMinat, "Data Minat")}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-gray-300 rounded" 
                onClick={handleClearAll}
              > Hapus </button>
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setOpen(false)}>
                Batal
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSave}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex justify-between items-center">
        <label>Pilih Tampilan: </label>
        <select 
          className="border p-2 rounded" 
          value={chartType} 
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="map">Peta</option>
          <option value="tabel">Tabel</option>
        </select>
      </div>
      
      <div className="mt-6">
        {chartType === "bar" && <Bar data={barData} />}
        {chartType === "pie" && <Pie data={pieData} />}
        {!open && chartType === "map" && (
          <div className="h-[500px] w-full">
            <MapContainer 
              center={[-6.9175, 107.6191]} 
              zoom={12} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {chartData.map((item, index) => {
                if (!item.lokasi_lat || !item.lokasi_long) return null;
                
                const { color } = quartiles ? 
                  getLevelAndColor(item.jumlah_anggota, quartiles) : 
                  { color: 'blue' };
                
                const radius = item.jumlah_anggota * 10; // Sesuaikan faktor pengali sesuai kebutuhan
                
                return (
                  <>
                    <Circle
                      key={`circle-${index}`}
                      center={[item.lokasi_lat, item.lokasi_long]}
                      radius={radius}
                      pathOptions={{
                        fillColor: color,
                        color: color,
                        fillOpacity: 0.4
                      }}
                    />
                    <Marker 
                      key={`marker-${index}`}
                      position={[item.lokasi_lat, item.lokasi_long]}
                    >
                      <Popup>
                        <strong>{item.nama_jamaah}</strong><br />
                        Jumlah Anggota: {item.jumlah_anggota}<br />
                        {quartiles && `Level: ${getLevelAndColor(item.jumlah_anggota, quartiles).level}`}
                      </Popup>
                    </Marker>
                  </>
                );
              })}
              <SetBounds markers={chartData.filter(item => item.lokasi_lat && item.lokasi_long)} />
            </MapContainer>
            
            {/* Tambahkan legenda */}
            {quartiles && (
              <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow z-[1000]">
                <h4 className="font-bold mb-1">Level:</h4>
                <div className="flex items-center mb-1">
                  <div className="w-4 h-4 bg-green-500 mr-2"></div>
                  <span>Level 1 ( ≤ {quartiles.Q1})</span>
                </div>
                <div className="flex items-center mb-1">
                  <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                  <span>Level 2 ( {quartiles.Q1} - {quartiles.Q2} )</span>
                </div>
                <div className="flex items-center mb-1">
                  <div className="w-4 h-4 bg-orange-500 mr-2"></div>
                  <span>Level 3 ( {quartiles.Q2} - {quartiles.Q3} )</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 mr-2"></div>
                  <span>Level 4 ( &gt; {quartiles.Q3} )</span>
                </div>
              </div>
            )}
          </div>
        )}
        {chartType === "tabel" && (
          <div className="mt-4">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div>
                <label className="mr-2">Filter Jamaah:</label>
                <select 
                  className="border p-2 rounded"
                  value={selectedJamaah}
                  onChange={(e) => {
                    setSelectedJamaah(e.target.value);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                >
                  <option value="semua">Semua Jamaah</option>
                  {chartData.map((jamaah) => (
                    <option key={jamaah.nama_jamaah} value={jamaah.nama_jamaah}>
                      {jamaah.nama_jamaah}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="mr-2">Items per page:</label>
                <select 
                  className="border p-2 rounded"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when items per page changes
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>

            {/* Table with scroll */}
            <div className="overflow-x-auto border rounded-lg" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table className="min-w-full bg-white">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr>
                    <th className="py-2 px-4 border">No</th>
                    <th className="py-2 px-4 border">Jamaah</th>
                    <th className="py-2 px-4 border">Nama Anggota</th>
                  </tr>
                </thead>
                <tbody>
                  {detailAnggota
                    .filter(anggota => 
                      selectedJamaah === "semua" || 
                      anggota.nama_jamaah === selectedJamaah
                    )
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((anggota, index) => (
                      <tr key={anggota.id_anggota} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="py-2 px-4 border">{anggota.nama_jamaah}</td>
                        <td className="py-2 px-4 border">{anggota.nama_lengkap}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {(() => {
              const filteredData = detailAnggota.filter(anggota => 
                selectedJamaah === "semua" || 
                anggota.nama_jamaah === selectedJamaah
              );
              const totalPages = Math.ceil(filteredData.length / itemsPerPage);

              if (totalPages <= 1) return null;

              return (
                <div className="flex justify-between items-center mt-4">
                  <div>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
                    {filteredData.length} entries
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="px-3 py-1 border rounded disabled:opacity-50"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      «
                    </button>
                    <button
                      className="px-3 py-1 border rounded disabled:opacity-50"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      ‹
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          className={`px-3 py-1 border rounded ${currentPage === pageNum ? 'bg-blue-500 text-white' : ''}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      className="px-3 py-1 border rounded disabled:opacity-50"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      ›
                    </button>
                    <button
                      className="px-3 py-1 border rounded disabled:opacity-50"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      »
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedStatistic;