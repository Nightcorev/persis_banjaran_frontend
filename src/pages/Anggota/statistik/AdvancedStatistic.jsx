import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
import api from "../../../utils/api";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Trash2 } from "lucide-react";

// Leaflet icon configuration
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
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
    setSelectedFields({});
    setFormData({});
  };

  const handleSave = async () => {
    const params = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      if (selectedFields[key] && value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });

    try {
      const response = await api.get('/advanced_statistic', { params });
      setChartData(response.data.statistics);
      setDetailAnggota(response.data.detail_anggota || []);
      setOpen(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderField = (field) => {
    if (field.type === "select" && options[field.optionsKey]) {
      return (
        <select
          className="border p-2 rounded w-full text-sm md:text-base"
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
        className="border p-2 rounded w-full text-sm md:text-base"
        value={formData[field.key] || ""}
        onChange={(e) => handleInputChange(field.key, e.target.value)}
      />
    );
  };

  const renderFieldGroup = (fields, title) => {
    return (
      <div>
        <h3 className="font-semibold text-blue-700 mb-2 border-b pb-1 text-sm md:text-base">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-sm md:text-base">
                <input
                  type="checkbox"
                  checked={!!selectedFields[field.key]}
                  onChange={() => handleCheckboxChange(field.key)}
                  className="w-4 h-4"
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

  const randomColors = [
    "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
    "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
    "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
    "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
    "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
    "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
    "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680"
  ];

  const barData = {
    labels: chartData.map((item) => item.nama_jamaah),
    datasets: [
      {
        label: "Jumlah Anggota",
        data: chartData.map((item) => item.jumlah_anggota),
        backgroundColor: chartData.map((_, index) => 
          randomColors[index % randomColors.length]
        ),
        borderColor: chartData.map((_, index) => 
          randomColors[index % randomColors.length]
        ),
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
          afterLabel: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((context.raw / total) * 100);
            return `Persentase: ${percentage}%`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          callback: function(value) {
            const label = this.getLabelForValue(value);
            return label.length > 8 ? `${label.substring(0, 8)}...` : label;
          },
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 10,
          }
        }
      }
    }
  };

  const pieData = {
    labels: chartData.map((item) => item.nama_jamaah),
    datasets: [
      {
        data: chartData.map((item) => item.jumlah_anggota),
        backgroundColor: chartData.map((_, index) => 
          randomColors[index % randomColors.length]
        ),
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 12,
          font: {
            size: 10,
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: label.length > 15 ? `${label.substring(0, 15)}...` : label,
                fillStyle: data.datasets[0].backgroundColor[i],
                hidden: false,
                index: i
              }));
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
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
  };
  
  const quartiles = chartData.length > 0 ? calculateQuartiles(chartData) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-2 md:p-4 shadow-lg rounded-lg">
      <button 
        className="px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
        onClick={() => setOpen(true)}
      >
        Isi Data
      </button>
      
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000] p-2 md:p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold">Isi Data</h2>
              <div className="flex space-x-2">
                <button 
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={handleClearAll}
                > 
                  <Trash2 size={18} />
                </button>
                <button 
                  className="px-3 py-1 bg-gray-300 rounded text-sm md:text-base"
                  onClick={() => setOpen(false)}
                >
                  Batal
                </button>
                <button 
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm md:text-base"
                  onClick={handleSave}
                >
                  Simpan
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {renderFieldGroup(fieldAnggota, "Data Anggota")}
              {renderFieldGroup(fieldKeluarga, "Data Keluarga")}
              {renderFieldGroup(fieldPendidikan, "Data Pendidikan")}
              {renderFieldGroup(fieldPekerjaan, "Data Pekerjaan")}
              {renderFieldGroup(fieldKeterampilan, "Data Keterampilan")}
              {renderFieldGroup(fieldMinat, "Data Minat")}
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-sm md:text-base">Pilih Tampilan:</label>
        <select 
          className="border p-2 rounded text-sm md:text-base w-full sm:w-auto"
          value={chartType} 
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="map">Peta</option>
          <option value="tabel">Tabel</option>
        </select>
      </div>
      
      <div className="mt-4">
        {chartType === "bar" && (
          <div className="flex flex-col gap-4">
            {/* Chart Container with Horizontal Scroll */}
            <div className="relative w-full h-96 overflow-x-auto">
              <div 
                className="absolute min-w-full" 
                style={{ height: '100%', minWidth: `${chartData.length * 50}px` }}
              >
                <Bar 
                  data={barData}
                  options={{
                    ...barOptions,
                    plugins: {
                      ...barOptions.plugins,
                      legend: {
                        display: true,
                        position: 'top',
                        labels: {
                          boxWidth: 12,
                          font: {
                            size: 10
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-3 text-sm md:text-base">Detail Data</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">No</th>
                      <th className="px-4 py-2 text-left">Jamaah</th>
                      <th className="px-4 py-2 text-left">Jumlah</th>
                      <th className="px-4 py-2 text-left">Warna</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {chartData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2 max-w-xs truncate" title={item.nama_jamaah}>
                          {item.nama_jamaah}
                        </td>
                        <td className="px-4 py-2 font-medium">{item.jumlah_anggota}</td>
                        <td className="px-4 py-2">
                          <span 
                            className="inline-block w-4 h-4 rounded-full"
                            style={{ 
                              backgroundColor: randomColors[index % randomColors.length] 
                            }}
                          ></span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {chartType === "pie" && (
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-2/3 h-96 lg:h-[500px]">
              <Pie 
                data={pieData}
                options={pieOptions}
              />
            </div>
            <div className="w-full lg:w-1/3 overflow-y-auto max-h-96 border rounded-lg p-4">
              <h3 className="font-bold mb-2">Detail Data:</h3>
              <ul className="space-y-2">
                {chartData.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span 
                      className="inline-block w-3 h-3 mr-2 rounded-full"
                      style={{ 
                        backgroundColor: randomColors[index % randomColors.length] 
                      }}
                    ></span>
                    <span>
                      {item.nama_jamaah}: {item.jumlah_anggota}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {!open && chartType === "map" && (
          <div className="h-[400px] w-full relative">
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
                
                const radius = item.jumlah_anggota * 10;
                
                return (
                  <div key={`marker-${index}`}>
                    <Circle
                      center={[item.lokasi_lat, item.lokasi_long]}
                      radius={radius}
                      pathOptions={{
                        fillColor: color,
                        color: color,
                        fillOpacity: 0.4
                      }}
                    />
                    <Marker 
                      position={[item.lokasi_lat, item.lokasi_long]}
                    >
                      <Popup>
                        <strong>{item.nama_jamaah}</strong><br />
                        Jumlah Anggota: {item.jumlah_anggota}<br />
                        {quartiles && `Level: ${getLevelAndColor(item.jumlah_anggota, quartiles).level}`}
                      </Popup>
                    </Marker>
                  </div>
                );
              })}
              <SetBounds markers={chartData.filter(item => item.lokasi_lat && item.lokasi_long)} />
            </MapContainer>
            
            {quartiles && (
              <div className="absolute bottom-2 right-2 bg-white p-2 rounded shadow z-[1000] text-xs md:text-sm">
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
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4">
              <div className="flex-1">
                <label className="mr-2 text-sm md:text-base">Filter Jamaah:</label>
                <select 
                  className="border p-2 rounded w-full text-sm md:text-base"
                  value={selectedJamaah}
                  onChange={(e) => {
                    setSelectedJamaah(e.target.value);
                    setCurrentPage(1);
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
              
              <div className="flex-1">
                <label className="mr-2 text-sm md:text-base">Items per page:</label>
                <select 
                  className="border p-2 rounded w-full text-sm md:text-base"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
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

            <div className="overflow-x-auto border rounded-lg" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="min-w-full bg-white text-sm md:text-base">
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

            {(() => {
              const filteredData = detailAnggota.filter(anggota => 
                selectedJamaah === "semua" || 
                anggota.nama_jamaah === selectedJamaah
              );
              const totalPages = Math.ceil(filteredData.length / itemsPerPage);

              if (totalPages <= 1) return null;

              return (
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm md:text-base">
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