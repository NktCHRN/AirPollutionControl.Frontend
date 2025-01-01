import React from "react";
import MapComponent from "./MapComponent";

function Map({ handleLocationClick }) {
  return (
    <div className="map-container">
      <h2>Select Location on the Map</h2>
      <MapComponent setLocation={handleLocationClick} />
    </div>
  );
}

export default Map;