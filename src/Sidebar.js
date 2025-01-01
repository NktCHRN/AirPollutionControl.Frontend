import React from "react";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Sidebar({ isOpen, location, message, closeSidebar, hourlyData, address }) {
  // Define a function to return a color based on the AQI value
  const getColorForAQI = (aqi) => {
    if (aqi <= 20) return "rgba(0, 255, 0, 1)"; // Green for good
    if (aqi <= 40) return "rgba(255, 255, 0, 1)"; // Yellow for fair
    if (aqi <= 60) return "rgba(255, 165, 0, 1)"; // Orange for moderate
    if (aqi <= 80) return "rgba(255, 0, 0, 1)"; // Red for poor
    if (aqi <= 100) return "rgba(139, 0, 0, 1)"; // Dark Red for very poor
    return "rgba(128, 0, 128, 1)"; // Purple for extremely poor
  };

  const handleLinkClick = () => {
    closeSidebar(); // Close the sidebar when the link is clicked
  };

  // Prepare chart data with all the data points
  const chartData = hourlyData
    ? {
        labels: hourlyData.map((item) => {
          const date = new Date(item.date);
          return date.toLocaleDateString("en-GB", { month: "short", day: "numeric" }); // Format as "Jan 1"
        }),
        datasets: [
          {
            label: "European AQI",
            data: hourlyData.map((item) => item.european_aqi),
            borderColor: "rgba(169, 169, 169, 1)", // Set connection line to gray
            backgroundColor: hourlyData.map((item) => getColorForAQI(item.european_aqi)), // Fill data points with color
            fill: false,
            pointStyle: "circle", // Set point style to circle
            pointRadius: 5, // Increase point size
            pointBackgroundColor: hourlyData.map((item) => getColorForAQI(item.european_aqi)), // Ensure points are filled with the correct color
            pointBorderColor: "rgba(169, 169, 169, 1)", // Set gray border for points
            pointBorderWidth: 2, // Point border width
            tension: 0.4, // Smooth curve with tension of 0.4
          },
        ],
      }
    : null;

  // X-axis ticks configuration: Show fewer ticks on the X-axis
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Air quality index for the past week",
        font: {
            size: 24, 
        },
        color: "#4caf50",
      },
      legend: {
        display: true, // Show legend
        labels: {
          generateLabels: () => [
            { text: "0-20 (Good)", fillStyle: "rgba(0, 255, 0, 1)", strokeStyle: "rgba(0, 255, 0, 1)" },
            { text: "20-40 (Fair)", fillStyle: "rgba(255, 255, 0, 1)", strokeStyle: "rgba(255, 255, 0, 1)" },
            { text: "40-60 (Moderate)", fillStyle: "rgba(255, 165, 0, 1)", strokeStyle: "rgba(255, 165, 0, 1)" },
            { text: "60-80 (Poor)", fillStyle: "rgba(255, 0, 0, 1)", strokeStyle: "rgba(255, 0, 0, 1)" },
            { text: "80-100 (Very Poor)", fillStyle: "rgba(139, 0, 0, 1)", strokeStyle: "rgba(139, 0, 0, 1)" },
            { text: "100+ (Extremely Poor)", fillStyle: "rgba(128, 0, 128, 1)", strokeStyle: "rgba(128, 0, 128, 1)" },
          ],
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true, // Skip labels if there are too many
          maxTicksLimit: 5, // Limit to 5 ticks
        },
      },
    },
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        <button className="close-btn" onClick={closeSidebar}>
          X
        </button>
        <h2>Location information</h2>

        {address && <p>{address}</p>}

        {/* Table display for air quality data */}
        {message && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>European AQI</td>
                <td>{message.european_aqi}</td>
              </tr>
              <tr>
                <td>PM10</td>
                <td>{message.pm10}</td>
              </tr>
              <tr>
                <td>PM2.5</td>
                <td>{message.pm2_5}</td>
              </tr>
              <tr>
                <td>Carbon monoxide</td>
                <td>{message.carbon_monoxide}</td>
              </tr>
              <tr>
                <td>Nitrogen dioxide</td>
                <td>{message.nitrogen_dioxide}</td>
              </tr>
              <tr>
                <td>Sulphur dioxide</td>
                <td>{message.sulphur_dioxide}</td>
              </tr>
              <tr>
                <td>Ozone</td>
                <td>{message.ozone}</td>
              </tr>
              <tr>
                <td>Aerosol optical depth</td>
                <td>{message.aerosol_optical_depth}</td>
              </tr>
              <tr>
                <td>Dust</td>
                <td>{message.dust}</td>
              </tr>
            </tbody>
          </table>
        )}

        {hourlyData && chartData && (
          <div>
            <Line data={chartData} options={options} />
          </div>
        )}

        <Link to="/detailed-stats" onClick={handleLinkClick}>
          View detailed past statistics
        </Link>

      </div>
    </div>
  );
}

export default Sidebar;