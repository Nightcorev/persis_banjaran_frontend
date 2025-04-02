// src/pages/Anggota/MapsStatistik.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from "../../../utils/api";

const MapStatistik = () => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchMonographyData = async () => {
      try {
        const response = await api.get('/getMonographyData');
        if (response.status === 200) {
          setMarkers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching monography data:', error);
      }
    };

    fetchMonographyData();
  }, []);

  return (
    <div className='bg-white p-4 shadow-lg rounded-lg'>
      <div className="flex-row space-x-4 mb-4">
            <label className="text-lg pe-2">Pilih Data</label>
            <select
              className="w-sm p-2 pe-10 border rounded-md text-xs"
              
            >
              <option value="Bar">Bar Chart</option>
              <option value="Pie">Pie Chart</option>
            </select>
      </div>
      <MapContainer center={[-7.250445, 112.768845]} zoom={5} style={{ height: "80vh", width: "100%"}}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lokasi_lat, marker.lokasi_long]}>
            <Popup>
              <strong>{marker.nama_jamaah}</strong>
              
            </Popup>
          </Marker>
        ))}
        <SetBounds markers={markers} />
      </MapContainer>
    </div>
  );
};

// Komponen untuk mengatur batas peta berdasarkan marker
const SetBounds = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(marker => [marker.lokasi_lat, marker.lokasi_long]));
      map.fitBounds(bounds);
    }
  }, [markers, map]);

  return null;
};

export default MapStatistik;
