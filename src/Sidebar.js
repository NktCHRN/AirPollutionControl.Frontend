import React from "react";
import "./Sidebar.css";

function Sidebar({ isOpen, location, message, closeSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        <button className="close-btn" onClick={closeSidebar}>X</button>
        <h2>Location Information</h2>
        <p dangerouslySetInnerHTML={{ __html: message }} /> {/* This allows HTML in message */}
      </div>
    </div>
  );
}

export default Sidebar;
