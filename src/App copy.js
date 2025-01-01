import React, { useEffect, useState } from "react";
import './App.css';
import MapComponent from "./MapComponent";
import Sidebar from "./Sidebar";

function App() {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (location) {  // Only send request if location is available
      fetch("http://127.0.0.1:5000/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: location.lat,
          lng: location.lng,
        }),
      })
        .then((response) => response.json())
        .then((data) => setMessage(`Lat: ${data.lat}, Lng: ${data.lng}`))  // Set message with lat and lng
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [location]);  // This will trigger whenever location changes

  const handleLocationClick = (latlng) => {
    setLocation(latlng);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo">
          <h1>Air Pollution Control System</h1>
        </div>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#notifications">Notifications</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <div className="map-container">
          <h2>Select Location on the Map</h2>
          <MapComponent setLocation={handleLocationClick} />
        </div>
      </main>

      <Sidebar
        isOpen={isSidebarOpen}
        location={location}
        message={message}  // Pass message state to Sidebar
        closeSidebar={closeSidebar}
      />
    </div>
  );
}

export default App;
