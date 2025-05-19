import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Dummy data statis
const dummyData = [
  { nama_jamaah: "Ahmad", lokasi_lat: -6.9175, lokasi_long: 107.6191 },
  { nama_jamaah: "Fatimah", lokasi_lat: -6.9351, lokasi_long: 107.6045 },
  { nama_jamaah: "Yusuf", lokasi_lat: -6.8902, lokasi_long: 107.6103 },
  { nama_jamaah: "Aisyah", lokasi_lat: -6.9201, lokasi_long: 107.6300 },
  { nama_jamaah: "Zaid", lokasi_lat: -6.9020, lokasi_long: 107.6120 },
];

const MapStatistic = () => {
  const [jumlahData, setJumlahData] = useState(3);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    setMarkers(dummyData.slice(0, jumlahData));
  }, [jumlahData]);

  return (
    <div className='bg-white p-4 shadow-lg rounded-lg'>
      <div className="flex-row space-x-4 mb-4">
        <label className="text-lg pe-2">Jumlah Data</label>
        <select
          className="w-sm p-2 pe-10 border rounded-md text-xs"
          value={jumlahData}
          onChange={(e) => setJumlahData(parseInt(e.target.value))}
        >
          <option value={2}>2 Marker</option>
          <option value={3}>3 Marker</option>
          <option value={5}>Semua Marker</option>
        </select>
      </div>

      <MapContainer center={[-6.9175, 107.6191]} zoom={12} style={{ height: "80vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lokasi_lat, marker.lokasi_long]}>
            <Popup><strong>{marker.nama_jamaah}</strong></Popup>
          </Marker>
        ))}
        <SetBounds markers={markers} />
      </MapContainer>
    </div>
  );
};

const SetBounds = ({ markers }) => {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lokasi_lat, m.lokasi_long]));
      map.fitBounds(bounds);
    }
  }, [markers, map]);
  return null;
};

export default MapStatistic;
