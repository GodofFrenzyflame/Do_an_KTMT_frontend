// src/components/ui/Charts/Map.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Biểu tượng cho vị trí hiện tại
const currentIcon = new L.Icon({
  iconUrl: '/static/point.png', // Đường dẫn tới hình ảnh biểu tượng cho vị trí hiện tại
  iconSize: [41, 41],                    // Kích thước của biểu tượng
  iconAnchor: [12, 41],                  // Điểm gắn vào tọa độ (phần dưới cùng của biểu tượng)
  popupAnchor: [1, -34],                 // Vị trí của Popup so với biểu tượng
  shadowSize: [41, 41]                   // Kích thước của bóng
});

// Biểu tượng cho địa chỉ đích
const destinationIcon = new L.Icon({
  iconUrl: '/static/pin.png', // Đường dẫn tới hình ảnh biểu tượng cho địa chỉ đích
  iconSize: [41, 41],                 // Kích thước của biểu tượng
  iconAnchor: [12, 41],               // Điểm gắn vào tọa độ (phần dưới cùng của biểu tượng)
  popupAnchor: [1, -34],              // Vị trí của Popup so với biểu tượng
  shadowSize: [41, 41]                // Kích thước của bóng
});

const Map = () => {
  const position = [10.772138, 106.658016]; // Tọa độ hiện tại
  const [destination, setDestination] = useState([10.77270023022209, 106.65917701616793]);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  const handleButtonClick = () => {
    if (googleMapsUrl) {
      window.open(googleMapsUrl, '_blank');
    } else {
      console.error('Google Maps URL is not set');
    }
  };

  const fetchLocationData = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/sensor/location', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        const newDestination = [result.X, result.Y];
        setDestination(newDestination);
        const newGoogleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(position.join(','))}&destination=${encodeURIComponent(newDestination.join(','))}`;
        setGoogleMapsUrl(newGoogleMapsUrl);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    fetchLocationData(accessToken);
    const intervalId = setInterval(() => {
      fetchLocationData(accessToken);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Marker cho vị trí hiện tại */}
        <Marker position={position} icon={currentIcon}>
          <Popup>
            Vị trí hiện tại: {position[0]}, {position[1]}
          </Popup>
        </Marker>
        {/* Marker cho địa chỉ đích */}
        <Marker position={destination} icon={destinationIcon}>
          <Popup>
            Địa chỉ đích: {destination[0]}, {destination[1]}
          </Popup>
        </Marker>
      </MapContainer>
      <button
        onClick={handleButtonClick}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        Wayfinding
      </button>
    </div>
  );
};

export default Map;
