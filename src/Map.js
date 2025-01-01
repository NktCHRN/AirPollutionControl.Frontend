import React from "react";
import MapComponent from "./MapComponent";

function Map({ handleLocationClick }) {
  return (
    <div>
      <h2>Click location on the map for air quality information</h2>
      <div className="map-container">
        <MapComponent setLocation={handleLocationClick} />
      </div>    
    </div>
  );
}

export default Map;