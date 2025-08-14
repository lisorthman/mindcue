import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiThermometer, FiDroplet, FiWind, FiCompass, FiHome } from "react-icons/fi";
import "../styles/Entrance.css";

const weatherIcons = {
  "broken clouds": "☁️",
  "clear sky": "☀️",
  rain: "🌧️",
  "few clouds": "⛅",
  "overcast clouds": "☁️",
};

const Entrance = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      setLocation(storedLocation);
      fetchWeather(storedLocation);
    }
  }, []);

  const fetchWeather = async (loc) => {
    try {
      setLoading(true);
      setError("");
      setWeatherData(null);

      const firstWord = loc.split(/[ ,]+/)[0];
      const res = await fetch(
        `http://localhost:9091/recommendation/${encodeURIComponent(firstWord)}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Fetch error", err);
      setError("Failed to load weather data.");
    } finally {
      setLoading(false);
    }
  };

  if (!location) return <div className="entrance-message">Please select a location first.</div>;

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading weather data...</p>
    </div>
  );

  if (error) return <div className="error-message">{error}</div>;
  if (!weatherData) return null;

  // Weather data variables
  const weatherDesc = weatherData?.rawWeather?.weather?.[0]?.description || "N/A";
  const weatherMain = weatherData?.rawWeather?.weather?.[0]?.main || "";
  const temp = weatherData?.rawWeather?.main?.temp;
  const feelsLike = weatherData?.rawWeather?.main?.feels_like;
  const humidity = weatherData?.rawWeather?.main?.humidity;
  const pressure = weatherData?.rawWeather?.main?.pressure;
  const windSpeed = weatherData?.rawWeather?.wind?.speed;
  const windDeg = weatherData?.rawWeather?.wind?.deg;
  const cityName = weatherData?.rawWeather?.name || weatherData?.city;

  return (
    <div className="entrance-container">
      <div className="entrance-card">
        <h1 className="weather-title">Weather in {cityName}</h1>

        <div className="weather-summary">
          <span className="weather-icon">
            {weatherIcons[weatherDesc.toLowerCase()] || "❓"}
          </span>
          <div className="weather-details">
            <p className="weather-condition">
              {weatherMain} - {weatherDesc}
            </p>
            <p className="weather-feels-like">
              Feels like: {feelsLike?.toFixed(1) ?? "N/A"} °C
            </p>
          </div>
          <div className="weather-temp">
            {temp !== undefined ? temp.toFixed(1) : "N/A"}°C
          </div>
        </div>

        <div className="weather-stats">
          <div className="stat-item">
            <FiDroplet className="stat-icon" />
            <div>
              <p className="stat-label">Humidity</p>
              <p className="stat-value">{humidity ?? "N/A"}%</p>
            </div>
          </div>
          <div className="stat-item">
            <FiThermometer className="stat-icon" />
            <div>
              <p className="stat-label">Pressure</p>
              <p className="stat-value">{pressure ?? "N/A"} hPa</p>
            </div>
          </div>
          <div className="stat-item">
            <FiWind className="stat-icon" />
            <div>
              <p className="stat-label">Wind Speed</p>
              <p className="stat-value">{windSpeed ?? "N/A"} m/s</p>
            </div>
          </div>
          <div className="stat-item">
            <FiCompass className="stat-icon" />
            <div>
              <p className="stat-label">Wind Direction</p>
              <p className="stat-value">{windDeg ?? "N/A"}°</p>
            </div>
          </div>
        </div>

        <button 
          className="recommendation-button"
          onClick={() => navigate("/home")}
        >
          <FiHome className="button-icon" />
          Auto Recommendation
        </button>
      </div>
    </div>
  );
};

export default Entrance;