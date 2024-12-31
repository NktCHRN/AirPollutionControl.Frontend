import React from "react";
import './App.css'; // You can style it with this CSS file

function App() {
  return (
    <div className="App">
      {/* Header Section */}
      <header className="App-header">
        <div className="logo">
          <h1>Air Pollution Control System</h1>
        </div>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#map">Map</a></li>
            <li><a href="#notifications">Notifications</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>
      </header>
      {/* Main content goes here */}
    </div>
  );
}

export default App;
