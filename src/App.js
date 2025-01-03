import React, { useEffect, useState } from "react";
import './App.css';
import Sidebar from "./Sidebar";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Notifications from "./Notifications";
import About from "./About";
import Map from "./Map";
import DetailedStats from "./DetailedStats"; // Import DetailedStats component
import Login from "./Login"; // Import Login component
import Registration from './Registration';
import Account from './Account'; // Import Account component

function App() {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [hourlyData, setHourlyData] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    if (location) {
      fetch("http://127.0.0.1:5000/api/air-quality", {
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
        .then((data) => {
          if (data.error) {
            setMessage({ error: data.error });
          } else {
            setMessage({
              european_aqi: data.european_aqi,
              pm10: data.pm10,
              pm2_5: data.pm2_5,
              carbon_monoxide: data.carbon_monoxide,
              nitrogen_dioxide: data.nitrogen_dioxide,
              sulphur_dioxide: data.sulphur_dioxide,
              ozone: data.ozone,
              aerosol_optical_depth: data.aerosol_optical_depth,
              dust: data.dust,
            });
            setHourlyData(data.hourly_aqi_data);
            setAddress(data.address)
          }
        })
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

  // Check if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // Update login status if token changes
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="logo">
            <h1>Air quality and pollution control</h1>
          </div>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/notifications">Notifications</Link></li>
              <li><Link to="/about">About</Link></li>
              {/* Conditionally render Login or Account button */}
              {isLoggedIn ? (
                <li><Link to="/account">Account</Link></li> // Link to account page
              ) : (
                <li><Link to="/login">Login</Link></li>
              )}
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Map handleLocationClick={handleLocationClick} />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/about" element={<About />} />
            <Route path="/detailed-stats" element={<DetailedStats location={location} message={message} />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} /> } /> {/* Login route */}
            <Route path="/registration" element={<Registration />} />
            <Route path="/account" element={<Account setIsLoggedIn={setIsLoggedIn} />} /> {/* Account route */}
          </Routes>
        </main>

        <Sidebar
          isOpen={isSidebarOpen}
          location={location}
          message={message}
          closeSidebar={closeSidebar}
          hourlyData={hourlyData}
          address={address}
        />
      </div>
    </Router>
  );
}

export default App;
