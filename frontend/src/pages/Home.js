import React, { useEffect, useState, useRef } from 'react';
import { FiMusic, FiSun, FiExternalLink } from 'react-icons/fi';
import "../styles/Home.css";

const weatherIcons = {
  "broken clouds": "☁️",
  "clear sky": "☀️",
  "rain": "🌧️",
  "few clouds": "⛅",
  "overcast clouds": "🌥️", 
};

const LoadingSpinner = () => (
  <div className="home-loading-container">
    <div className="spinner"></div>
    <p className="loading-text">Loading recommendations...</p>
  </div>
);

const SectionList = ({ title, items }) => (
  <div className="section-container fade-in">
    <h3 className="section-title">{title}</h3>
    <ul className="section-list">
      {items.map((item, i) => {
        const cleanItem = item.replace(/^\*+/, '').trim().replace(/^\.+/, '');
        return <li key={i} className="section-item slide-up">{cleanItem}</li>;
      })}
    </ul>
  </div>
);

function parseAISuggestions(text) {
  const sections = {};
  const parts = text.split(/\*\*(.*?)\*\*/).filter(s => s.trim() !== '');

  for (let i = 1; i < parts.length; i += 2) {
    let sectionTitle = parts[i].trim();
    if (sectionTitle.endsWith(':')) sectionTitle = sectionTitle.slice(0, -1);

    const content = parts[i + 1] || '';
    const lines = content.split('\n');

    const items = [];
    let currentItem = null;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('* ')) {
        if (currentItem !== null) {
          items.push(currentItem.trim());
        }
        currentItem = trimmed.slice(2);
      } else if (trimmed === '') {
        // skip empty lines
      } else {
        if (currentItem !== null) {
          currentItem += ' ' + trimmed;
        } else {
          items.push(trimmed);
        }
      }
    });

    if (currentItem !== null) {
      items.push(currentItem.trim());
    }

    sections[sectionTitle] = items;
  }

  return sections;
}

const Home = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parsedSuggestions, setParsedSuggestions] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const userLocation = localStorage.getItem('userLocation');
    if (userLocation) {
      setLocation(userLocation);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const fetchData = async () => {
        try {
          setLoading(true);
          setError('');
          setWeatherData(null);

          const firstWord = userLocation.split(/[ ,]+/)[0];
          const encodedCity = encodeURIComponent(firstWord);

          const response = await fetch(
            `http://localhost:9091/recommendation/${encodedCity}`,
            { signal }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setWeatherData(data);
        } catch (error) {
          if (error.name !== 'AbortError') {
            setError('Failed to fetch recommendations. Please try again.');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  useEffect(() => {
    if (weatherData?.ai_suggestion && typeof weatherData.ai_suggestion === 'string') {
      const parsed = parseAISuggestions(weatherData.ai_suggestion);
      setParsedSuggestions(parsed);
    } else {
      setParsedSuggestions(null);
    }
  }, [weatherData]);

  return (
    <div className="home-container">
      <div className="home-card fade-in">
        <h1 className="home-title">🌟 MindCue's got your back today</h1>

        {location ? (
          <><h2 className="location-display slide-up">
            Checking the skies over <span>{location}</span>
          </h2><p> Let's see what's happening</p></>
        ) : (
          <p className="no-location">No city selected.</p>
        )}

        {loading && <LoadingSpinner />}

        {error && <p className="error-message">{error}</p>}

        {weatherData && !loading && !error && (
          <div className="weather-recommendation-box fade-in">
            <div className="weather-summary">
              <span className="weather-icon bounce">
                {weatherIcons[weatherData.weather.toLowerCase()] || '❓'}
              </span>
              <div className="weather-details">
                <p className="weather-condition">{weatherData.weather}</p>
                <p className="weather-city">{location}</p>
              </div>
              <div className="temperature glow">
                {weatherData.temperature.toFixed(1)}°C
              </div>
            </div>

            <div className="ai-suggestions">
              <h2 className="suggestions-title">
                <FiSun className="section-icon spin" />
                What might lift your spirits today?
              </h2>

              {parsedSuggestions ? (
                Object.entries(parsedSuggestions).map(([section, items]) => (
                  <SectionList key={section} title={section} items={items} />
                ))
              ) : (
                <p>{weatherData.ai_suggestion}</p>
              )}
            </div>

            {weatherData.playlist_link && (
              <a
                href={weatherData.playlist_link}
                target="_blank"
                rel="noopener noreferrer"
                className="playlist-link pulse"
              >
                <FiMusic className="link-icon" />
                {weatherData.playlist_keyword || 'Listen on Spotify'}
                <FiExternalLink className="external-icon" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
