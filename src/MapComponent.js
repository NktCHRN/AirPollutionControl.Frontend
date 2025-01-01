import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationMarker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng); // Updates state with clicked location
    },
  });
  return null;
}

function MapComponent({ setLocation }) {
  const [position, setPosition] = useState([50.4501, 30.5236]); // Kyiv coordinates

  return (
    <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker setLocation={(latlng) => { setPosition(latlng); setLocation(latlng); }} />
    </MapContainer>
  );
}

export default MapComponent;
