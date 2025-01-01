import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker setLocation={setLocation} />
    </MapContainer>
  );
}

export default MapComponent; // Ensure this is a default export