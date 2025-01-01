import React from "react";
import "./Sidebar.css";

function Sidebar({ isOpen, location, message, closeSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        <button className="close-btn" onClick={closeSidebar}>X</button>
        <h2>Location Information</h2>
        <p>{message}</p> {/* Display message in the sidebar */}
      </div>
    </div>
  );
}

export default Sidebar;
