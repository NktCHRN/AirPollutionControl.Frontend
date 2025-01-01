import React from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Component to handle map clicks
function LocationMarker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng); // Updates state with clicked location
    },
  });
  return null;
}

function MapComponent({ setLocation }) {
  return (
    <MapContainer center={[50.4501, 30.5236]} zoom={6} style={{ width: "100%", height: "70vh" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker setLocation={setLocation} />
    </MapContainer>
  );
}

export default MapComponent; // Ensure this is a default export