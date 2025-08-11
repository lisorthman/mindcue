import React from 'react';

const weatherIcons = {
  "clear sky": "☀️",
  "few clouds": "⛅",
  "scattered clouds": "☁️",
  "broken clouds": "☁️",
  "overcast clouds": "☁️",
  "rain": "🌧️",
  // add more as needed
};

const WeatherCard = ({ data }) => {
  if (!data) return <p>Loading weather...</p>;

  const weatherDesc = data.weather?.[0]?.description || "N/A";
  const weatherMain = data.weather?.[0]?.main || "";
  const temp = data.main?.temp?.toFixed(1) || "N/A";
  const feelsLike = data.main?.feels_like?.toFixed(1) || "N/A";
  const humidity = data.main?.humidity || "N/A";
  const pressure = data.main?.pressure || "N/A";
  const windSpeed = data.wind?.speed || "N/A";
  const windDeg = data.wind?.deg || "N/A";

  // Convert wind degrees to direction
  const degToDirection = (deg) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(deg / 45) % 8];
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: 'auto',
      padding: 24,
      background: "linear-gradient(145deg, #e3f2fd, #bbdefb)",
      borderRadius: 24,
      boxShadow: "8px 8px 16px #a1c4fd, -8px -8px 16px #ffffff",
      color: "#0d47a1",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      userSelect: "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{
          fontSize: 72,
          padding: 24,
          backgroundColor: "rgba(255,255,255,0.7)",
          borderRadius: "50%",
          boxShadow: "4px 4px 12px rgba(0,0,0,0.1)",
          flexShrink: 0,
          textAlign: "center",
          lineHeight: 1,
        }}>
          {weatherIcons[weatherDesc.toLowerCase()] || "❓"}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontWeight: "700", fontSize: 28 }}>{data.name}</h2>
          <p style={{ margin: "4px 0 12px", fontWeight: "600", fontSize: 18, color: "#1a237e" }}>
            {weatherMain} — {weatherDesc}
          </p>
          <div style={{ fontSize: 48, fontWeight: "800", color: "#1565c0" }}>
            {temp}°C
          </div>
          <p style={{ marginTop: 6, fontStyle: "italic", color: "#3949ab" }}>
            Feels like {feelsLike}°C
          </p>
        </div>
      </div>

      <hr style={{
        margin: "24px 0",
        border: 0,
        borderTop: "1px solid #90caf9",
        borderRadius: 1,
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", color: "#0d47a1", fontWeight: "600" }}>
        <div>
          <p style={{ margin: "6px 0" }}>Humidity</p>
          <p style={{ fontSize: 18 }}>{humidity}%</p>
        </div>
        <div>
          <p style={{ margin: "6px 0" }}>Pressure</p>
          <p style={{ fontSize: 18 }}>{pressure} hPa</p>
        </div>
        <div>
          <p style={{ margin: "6px 0" }}>Wind</p>
          <p style={{ fontSize: 18 }}>
            {windSpeed} m/s ({degToDirection(windDeg)})
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
