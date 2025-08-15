import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiThermometer,
  FiDroplet,
  FiWind,
  FiCompass,
  FiHome,
} from "react-icons/fi";
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
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      setLocation(storedLocation);
      fetchWeather(storedLocation);
      fetchNews();
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

  const fetchNews = async () => {
    try {
      const res = await fetch("http://localhost:9092/news");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setNewsData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("News fetch error:", err);
      setNewsData([]);
    }
  };

  // Render states
  if (!location)
    return <div className="entrance-message">Please select a location first.</div>;

  if (loading)
    return (
      <div className="loading-screen">
        <div className="loading-animation">
          <div className="sun"></div>
          <div className="cloud"></div>
        </div>
        <p className="loading-text">Loading weather data...</p>
      </div>
    );

  if (error) return <div className="error-message">{error}</div>;
  if (!weatherData) return null;

  // Weather data
  const weatherDesc =
    weatherData?.rawWeather?.weather?.[0]?.description || "N/A";
  const weatherMain = weatherData?.rawWeather?.weather?.[0]?.main || "";
  const temp = weatherData?.rawWeather?.main?.temp;
  const feelsLike = weatherData?.rawWeather?.main?.feels_like;
  const humidity = weatherData?.rawWeather?.main?.humidity;
  const pressure = weatherData?.rawWeather?.main?.pressure;
  const windSpeed = weatherData?.rawWeather?.wind?.speed;
  const windDeg = weatherData?.rawWeather?.wind?.deg;
  const cityName = weatherData?.rawWeather?.name || weatherData?.city;

  return (
    <div className="entrance-wrapper">
      <div className="entrance-card fade-in">
        <h1 className="weather-title">
          Weather in <span>{cityName}</span>
        </h1>

        {/* WEATHER SUMMARY */}
        <div className="weather-summary slide-up">
          <span className="weather-icon bounce">
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

        {/* WEATHER STATS */}
        <div className="weather-stats fade-in">
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

        {/* NEWS SECTION */}
        <div className="news-section fade-in">
          <h2>Latest Sri Lanka News</h2>
          {newsData.length > 0 ? (
            <ul className="news-list">
              {newsData.map((article, index) => (
                <li key={index} className="news-item">
                  <a
                    href={article.link ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-link"
                  >
                    {article.title ?? "No title"}
                  </a>
                  <p className="news-description">{article.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No news found for this location.</p>
          )}
        </div>

        {/* NAVIGATION BUTTON */}
        <button
          className="recommendation-button pulse"
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
