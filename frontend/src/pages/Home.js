import React, { useEffect, useState, useRef } from 'react';

const weatherIcons = {
  "broken clouds": "☁️",
  "clear sky": "☀️",
  "rain": "🌧️",
  "few clouds": "⛅",
  // add more mappings as needed
};

const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', marginTop: 20 }}>
    <div
      className="spinner"
      style={{
        width: 40,
        height: 40,
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #1DB954',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg);}
        100% { transform: rotate(360deg);}
      }
    `}</style>
  </div>
);

const SectionList = ({ title, items }) => (
  <div style={{ marginBottom: 30 }}>
    <h3
      style={{
        borderBottom: '3px solid #1DB954',
        paddingBottom: 8,
        color: '#176c2b', // darker green for subheading
        fontWeight: '600',
        fontSize: '22px',
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
      }}
    >
      {title}
    </h3>
    <ul
      style={{
        paddingLeft: 25,
        color: '#333',
        lineHeight: 1.7,
        marginBottom: 15,
        listStyleType: 'none',
      }}
    >
      {items.map((item, i) => {
        const cleanItem = item.replace(/^\*+/, '').trim().replace(/^\.+/, '');
        return (
          <li
            key={i}
            style={{
              marginBottom: 12,
              fontSize: '17px',
              color: '#444',
            }}
          >
            {cleanItem}
          </li>
        );
      })}
    </ul>
  </div>
);



// Parse AI suggestion string into sections and bullet points
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
        currentItem = trimmed.slice(2); // remove '* '
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
    <div
      style={{
        maxWidth: 700,
        margin: 'auto',
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#222',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Welcome to MindCue</h1>

      {location ? (
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>
          Your selected city: <span style={{ color: '#1DB954' }}>{location}</span>
        </h2>
      ) : (
        <p style={{ textAlign: 'center' }}>No city selected.</p>
      )}

      {loading && <LoadingSpinner />}

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {weatherData && !loading && !error && (
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: 12,
            padding: 25,
            backgroundColor: '#fafafa',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
            <span style={{ fontSize: 48, marginRight: 15 }}>
              {weatherIcons[weatherData.weather.toLowerCase()] || '❓'}
            </span>
            <div>
              <p style={{ margin: 0, fontSize: 18, color: '#555' }}>
                <strong>Weather Condition:</strong>
              </p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 'bold' }}>{weatherData.weather}</p>
            </div>
            <div
              style={{
                marginLeft: 'auto',
                fontSize: 32,
                fontWeight: 'bold',
                color: '#1DB954',
              }}
            >
              {weatherData.temperature.toFixed(1)}°C
            </div>
          </div>

          <div>
            <h2
              style={{
                borderBottom: '3px solid #1DB954',
                paddingBottom: 8,
                marginBottom: 15,
              }}
            >
              AI Suggestions
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
            <p style={{ marginTop: 30, fontSize: 18 }}>
              <strong>Suggested Playlist: </strong>
              <a
                href={weatherData.playlist_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1DB954', textDecoration: 'none', fontWeight: 'bold' }}
              >
                🎵 {weatherData.playlist_keyword || 'Listen on Spotify'}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
