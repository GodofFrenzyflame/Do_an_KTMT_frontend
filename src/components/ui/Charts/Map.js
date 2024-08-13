// src/components/ui/Charts/Map.js
import React from 'react';
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

  const destination = [10.77270023022209, 106.65917701616793]; // Tọa độ đích

  // Tạo URL chỉ đường
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(position.join(','))}&destination=${encodeURIComponent(destination.join(','))}`;

  const handleButtonClick = () => {
    window.open(googleMapsUrl, '_blank');
  };

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
          zIndex: 1000 // Đảm bảo nút xuất hiện trên cùng
        }}
      >
        Wayfinding 
      </button>
    </div>
  );
};

export default Map;
