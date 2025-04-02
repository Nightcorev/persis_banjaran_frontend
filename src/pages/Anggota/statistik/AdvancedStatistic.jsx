import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
import api from "../../../utils/api";

const AdvancedStatistic = () => {
  const [open, setOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState({});
  const [formData, setFormData] = useState({});
  const [options, setOptions] = useState({ pendidikan: [], pekerjaan: [], keahlian: [] });
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/data_choice_advanced_statistic")
      .then((response) => response.json())
      .then((data) => {
        setOptions({
          pendidikan: data.pendidikan.map((p) => ({ id: p.id_tingkat_pendidikan, label: p.pendidikan })),
          pekerjaan: data.pekerjaan.map((p) => ({ id: p.id_master_pekerjaan, label: p.nama_pekerjaan })),
          keahlian: data.keahlian.map((k) => ({ id: k.id_minat, label: k.nama_minat })),
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
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

  const handleSave = () => {
    const queryParams = new URLSearchParams({
      pendidikan: formData.pendidikan || "",
      pekerjaan: formData.pekerjaan || "",
      keahlian: formData.keahlian || "",
    }).toString();

    fetch(`http://127.0.0.1:8000/api/generate_advanced_statistic?${queryParams}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setChartData(data);
        setOpen(false);
      })
      .catch((error) => console.error("Error mengirim data:", error));
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

  return (
    <div className='bg-white p-4 shadow-lg rounded-lg'>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-gray-500" onClick={() => setOpen(true)}>Isi Data</button>
      {open && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-[60vw] max-h-[80vh] overflow-y-auto'>
            <h2 className='text-lg font-bold mb-4'>Isi Data</h2>
            <div className='grid grid-cols-2 gap-4'>
              {[
                { key: "pendidikan", label: "Pendidikan" },
                { key: "pekerjaan", label: "Pekerjaan" },
                { key: "keahlian", label: "Keahlian" },
              ].map((field) => (
                <div key={field.key} className='flex items-center gap-2'>
                  <input type='checkbox' checked={selectedFields[field.key] || false} onChange={() => handleCheckboxChange(field.key)} />
                  <label>{field.label}</label>
                  {selectedFields[field.key] && (
                    <select
                      className='border p-2 w-full rounded'
                      value={formData[field.key] || ""}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                    >
                      <option value="">Pilih {field.label}</option>
                      {options[field.key].map((option) => (
                        <option key={option.id} value={option.id}>{option.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
            <div className='mt-4 flex justify-end space-x-2'>
              <button className='px-4 py-2 bg-gray-300 rounded' onClick={() => setOpen(false)}>Batal</button>
              <button className='px-4 py-2 bg-blue-500 text-white rounded' onClick={handleSave}>Simpan</button>
            </div>
          </div>
        </div>
      )}
      <div className='mt-4 flex justify-between items-center'>
        <label>Pilih Tampilan: </label>
        <select className='border p-2 rounded' value={chartType} onChange={(e) => setChartType(e.target.value)}>
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>
      <div className='mt-6'>
        {chartType === "bar" ? <Bar data={barData} /> : <Pie data={pieData} />}
      </div>
    </div>
  );
};

export default AdvancedStatistic;
