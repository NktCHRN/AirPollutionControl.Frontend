import React from "react";
import image1 from "./about-pollution.jpg";
import image2 from "./about-pollution-2.jpg";
import image3 from "./about-pollution-3.jpg";

function About() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Air quality and pollution control - we help people fight air pollution</h1>
      
      <h2>What is Air Pollution?</h2>
      <p>
        Air pollution is the contamination of our atmosphere by harmful substances like gases, particulate matter, and biological materials. 
        It affects our health, environment, and climate. From smoggy cities to rural areas near industrial zones, air pollution knows no boundaries.
      </p>
      
      <div 
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          flexWrap: "wrap", // Allow images to wrap on smaller screens
          justifyContent: "center"
        }}
      >
        <img src={image1} alt="Air pollution" style={{ height: "300px", maxWidth: "100%", objectFit: "cover" }} />
        <img src={image3} alt="Air pollution (factories)" style={{ height: "300px", maxWidth: "100%", objectFit: "cover" }} />
        <img src={image2} alt="Nature, running man" style={{ height: "300px", maxWidth: "100%", objectFit: "cover" }} />
      </div>
      
      <h2>Why Should You Care?</h2>
      <ul>
        <li><b>Your Health</b>: Air pollution is linked to respiratory issues, heart disease, and other serious health conditions.</li>
        <li><b>The Environment</b>: Acid rain, damaged ecosystems, and climate change are just the beginning.</li>
        <li><b>The Future</b>: Cleaner air means a sustainable planet for the generations to come.</li>
      </ul>
      
      <h2>Breathe better. Live better. Let's create a world where clean air is a right, not a privilege.</h2>
      <h3>Take the first step today — learn more, act smarter, and inspire change.</h3>
      
      <p>Stay informed about the air you breathe with state-of-the-art monitoring systems.</p>
      <ul>
        <li><b>Real-Time Data</b>: Ground stations and sensors provide up-to-the-minute readings.</li>
        <li><b>Global Coverage</b>: Satellite imagery tracks air quality across the world.</li>
        <li><b>Smart Technology</b>: AI and IoT-powered tools predict pollution trends and keep you ahead.</li>
      </ul>
      
      <p>And... if you are a government representative, we can provide you a solution for air quality monitoring.</p>
    </div>
  );
}

export default About;
