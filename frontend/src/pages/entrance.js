import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    fetchNews(); // now always fetches Sri Lanka news
  }
}, []);


  // Fetch weather data
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


// Fetch news data
const fetchNews = async () => {
  try {
    const res = await fetch("http://localhost:9092/news");

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();  // no ": any"


    // Only set if it's an array
    setNewsData(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("News fetch error:", err);
    setNewsData([]); // optional fallback
  }
};


  if (!location) return <p>Please select a location first.</p>;
  if (loading) return <p>Loading weather data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!weatherData) return null;

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
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h1>Weather in {cityName}</h1>

      {/* WEATHER CARD */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: 25,
          borderRadius: 12,
          backgroundColor: "#fafafa",
          display: "flex",
          alignItems: "center",
          marginBottom: 20,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <span style={{ fontSize: 48, marginRight: 15 }}>
          {weatherIcons[weatherDesc.toLowerCase()] || "❓"}
        </span>
        <div>
          <p style={{ margin: 0, fontSize: 18, color: "#555" }}>
            <strong>Condition:</strong>
          </p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: "bold" }}>
            {weatherMain} - {weatherDesc}
          </p>
          <p style={{ margin: 0, color: "#666" }}>
            Feels like: {feelsLike?.toFixed(1) ?? "N/A"} °C
          </p>
        </div>
        <div
          style={{
            marginLeft: "auto",
            fontSize: 32,
            fontWeight: "bold",
            color: "#1DB954",
          }}
        >
          {temp !== undefined ? temp.toFixed(1) : "N/A"}°C
        </div>
      </div>

      {/* WEATHER DETAILS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: 400,
          marginBottom: 20,
        }}
      >
        <div>
          <p>Humidity: {humidity ?? "N/A"}%</p>
          <p>Pressure: {pressure ?? "N/A"} hPa</p>
        </div>
        <div>
          <p>Wind Speed: {windSpeed ?? "N/A"} m/s</p>
          <p>Wind Direction: {windDeg ?? "N/A"}°</p>
        </div>
      </div>

      {/* NEWS SECTION */}
      <div style={{ marginTop: 30 }}>
        <h2>Latest Sri Lanka News</h2>
        {newsData.length > 0 ? (
          <ul style={{ paddingLeft: 20 }}>
            {newsData.map((article, index) => (
              <li key={index} style={{ marginBottom: 10 }}>
                <a href={article.link ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1DB954", fontWeight: "bold" }}
                >
                  {article.title ?? "No title"}
                </a>
                <p style={{ margin: "5px 0", color: "#555" }}>
                  {article.description}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No news found for this location.</p>
        )}
      </div>

      <button
        style={{
          marginTop: 20,
          padding: "10px 20px",
          backgroundColor: "#1DB954",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "600",
          fontSize: 16,
        }}
        onClick={() => navigate("/home")}
      >
        Auto Recommendation
      </button>
    </div>
  );
};

export default Entrance;
