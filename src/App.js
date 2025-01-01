import React, { useEffect, useState } from "react";
import './App.css';
import Sidebar from "./Sidebar";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Notifications from "./Notifications";
import About from "./About";
import Map from "./Map";  // Import Map component

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
  }, [location]);

  const handleLocationClick = (latlng) => {
    setLocation(latlng);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="logo">
            <h1>Air Pollution Control System</h1>
          </div>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/notifications">Notifications</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Map handleLocationClick={handleLocationClick} />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <Sidebar
          isOpen={isSidebarOpen}
          location={location}
          message={message}  // Pass message state to Sidebar
          closeSidebar={closeSidebar}
        />
      </div>
    </Router>
  );
}

export default App;
