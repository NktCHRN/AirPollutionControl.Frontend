import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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

function DetailedStats({ location }) {
  const [detailedStats, setDetailedStats] = useState(null);
  const [pollutant, setPollutant] = useState("european_aqi"); // Default pollutant
  const [days, setDays] = useState(7); // Default past days
  const [filteredStats, setFilteredStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    if (location) {
      // Fetch data once when location is available
      fetch(`http://127.0.0.1:5000/api/detailed-stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: location.lat,
          lng: location.lng,
          pollutant: pollutant,
          days: 30, // Fetch data for the past 30 days by default
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.detailed_data) {
            setDetailedStats(data.detailed_data);
            setAddress(data.address);
            filterData(data.detailed_data, pollutant, days); // Filter data on first fetch
          }
        })
        .catch((error) => console.error("Error fetching detailed stats:", error));
    }
  }, [location]);  // Only fetch data once when location changes

  const getColorForPollutant = (value, pollutant) => {
    // Define the pollutant ranges
    const ranges = {
      "european_aqi": [
        { max: 20, color: "rgba(0, 255, 0, 1)" }, // Good
        { max: 40, color: "rgba(255, 255, 0, 1)" }, // Fair
        { max: 60, color: "rgba(255, 165, 0, 1)" }, // Moderate
        { max: 80, color: "rgba(255, 0, 0, 1)" }, // Poor
        { max: 100, color: "rgba(139, 0, 0, 1)" }, // Very Poor
        { max: Infinity, color: "rgba(128, 0, 128, 1)" }, // Extremely Poor
      ],
      "european_aqi_pm2_5": [
        { max: 10, color: "rgba(0, 255, 0, 1)" }, // Good
        { max: 20, color: "rgba(255, 255, 0, 1)" }, // Fair
        { max: 25, color: "rgba(255, 165, 0, 1)" }, // Moderate
        { max: 50, color: "rgba(255, 0, 0, 1)" }, // Poor
        { max: 75, color: "rgba(139, 0, 0, 1)" }, // Very Poor
        { max: 800, color: "rgba(128, 0, 128, 1)" }, // Extremely Poor
      ],
      "european_aqi_pm10": [
        { max: 20, color: "rgba(0, 255, 0, 1)" }, // Good
        { max: 40, color: "rgba(255, 255, 0, 1)" }, // Fair
        { max: 50, color: "rgba(255, 165, 0, 1)" }, // Moderate
        { max: 100, color: "rgba(255, 0, 0, 1)" }, // Poor
        { max: 150, color: "rgba(139, 0, 0, 1)" }, // Very Poor
        { max: 1200, color: "rgba(128, 0, 128, 1)" }, // Extremely Poor
      ],
      "european_aqi_nitrogen_dioxide": [
        { max: 40, color: "rgba(0, 255, 0, 1)" }, // Good
        { max: 90, color: "rgba(255, 255, 0, 1)" }, // Fair
        { max: 120, color: "rgba(255, 165, 0, 1)" }, // Moderate
        { max: 230, color: "rgba(255, 0, 0, 1)" }, // Poor
        { max: 340, color: "rgba(139, 0, 0, 1)" }, // Very Poor
        { max: 1000, color: "rgba(128, 0, 128, 1)" }, // Extremely Poor
      ],
      "european_aqi_ozone": [
        { max: 50, color: "rgba(0, 255, 0, 1)" }, // Good
        { max: 100, color: "rgba(255, 255, 0, 1)" }, // Fair
        { max: 130, color: "rgba(255, 165, 0, 1)" }, // Moderate
        { max: 240, color: "rgba(255, 0, 0, 1)" }, // Poor
        { max: 380, color: "rgba(139, 0, 0, 1)" }, // Very Poor
        { max: 800, color: "rgba(128, 0, 128, 1)" }, // Extremely Poor
      ],
      "european_aqi_sulphur_dioxide": [
        { max: 100, color: "rgba(0, 255, 0, 1)" }, // Good
        { max: 200, color: "rgba(255, 255, 0, 1)" }, // Fair
        { max: 350, color: "rgba(255, 165, 0, 1)" }, // Moderate
        { max: 500, color: "rgba(255, 0, 0, 1)" }, // Poor
        { max: 750, color: "rgba(139, 0, 0, 1)" }, // Very Poor
        { max: 1250, color: "rgba(128, 0, 128, 1)" }, // Extremely Poor
      ]
    };
  
    const rangesForPollutant = ranges[pollutant] || [];
    for (let range of rangesForPollutant) {
      if (value <= range.max) return range.color;
    }
    return "rgba(128, 0, 128, 1)"; // Default color (extremely poor)
  };

  const filterData = (data, pollutant, days) => {
    // Filter data based on the selected days
    const endDate = new Date(Math.max(...data.map((item) => new Date(item.date))));
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - days);

    const filtered = data.filter((item) => new Date(item.date) >= startDate);

    // Set the filtered data
    setFilteredStats(filtered);

    // Prepare chart data
    const labels = filtered.map((item) =>
      new Date(item.date).toLocaleDateString("en-GB", { month: "short", day: "numeric" })
    );
    const dataPoints = filtered.map((item) => item[pollutant]);
    
    // Calculate color for each point individually
    const pointColors = filtered.map((item) =>
      getColorForPollutant(item[pollutant], pollutant)
    );

    setChartData({
      labels: labels,
      datasets: [
        {
          label: pollutant,
          data: dataPoints,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
          pointStyle: "circle",
          pointRadius: 5,
          pointBackgroundColor: pointColors, // Use dynamic colors for each dot
          pointBorderColor: "rgba(75, 192, 192, 1)",
          pointBorderWidth: 2,
        },
      ],
    });
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Air quality over time",
        font: {
            size: 24, 
        },
      },
      legend: {
        display: false,  // This removes the legend
      },
    },
  };

  const handlePollutantChange = (e) => {
    const selectedPollutant = e.target.value;
    setPollutant(selectedPollutant);

    // If data is already fetched, filter it based on new pollutant
    if (detailedStats) {
      filterData(detailedStats, selectedPollutant, days);
    }
  };

  const handleDaysChange = (e) => {
    const selectedDays = e.target.value;
    setDays(selectedDays);

    // If data is already fetched, filter it based on new days
    if (detailedStats) {
      filterData(detailedStats, pollutant, selectedDays);
    }
  };

  return (
    <div className="detailed-stats">
      <h2>Location statistics</h2>
      <div className="location-info">
        {location && (
          <p>
            <strong>Latitude:</strong> {location.lat}, <strong>Longitude:</strong> {location.lng}
          </p>
        )}
        {address && <p><strong>Address:</strong> {address}</p>}
      </div>
      <div className="filters">
        <div>
          <label>Metric:</label>
          <select onChange={handlePollutantChange} value={pollutant}>
            <option value="european_aqi">European AQI</option>
            <option value="european_aqi_pm2_5">PM2.5</option>
            <option value="european_aqi_pm10">PM10</option>
            <option value="european_aqi_nitrogen_dioxide">Nitrogen Dioxide</option>
            <option value="european_aqi_ozone">Ozone</option>
            <option value="european_aqi_sulphur_dioxide">Sulphur Dioxide</option>
          </select>
        </div>
        <div>
          <label>Past Days:</label>
          <select onChange={handleDaysChange} value={days}>
            {[...Array(30).keys()].map((i) => (
              <option key={i} value={i + 1}>
                {i + 1} days
              </option>
            ))}
          </select>
        </div>
      </div>
  
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>Location is not selected</p>
      )}
    </div>
  );
}

export default DetailedStats;
