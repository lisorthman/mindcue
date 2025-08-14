import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiChevronRight, FiLoader } from 'react-icons/fi';
import '../styles/LocationSelect.css';

const LocationSelect = () => {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const fetchCities = async (input) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities`,
        {
          params: { namePrefix: input, limit: 10, sort: '-population' },
          headers: {
            'X-RapidAPI-Key': '0f410021a9msh30cb50860138ac2p1ace31jsn943a466c8e23',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
          },
        }
      );
      const cityNames = response.data.data.map(
        (city) => `${city.city}, ${city.country}`
      );
      setCities(cityNames);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query.length > 2) {
      const debounceTimer = setTimeout(() => {
        fetchCities(query);
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setCities([]);
    }
  }, [query]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (cities.includes(val)) {
      setSelectedCity(val);
    } else {
      setSelectedCity('');
    }
  };

  const handleContinue = () => {
    if (selectedCity) {
      localStorage.setItem('userLocation', selectedCity);
      navigate('/entrance');
    } else {
      alert('Please select a city from the list.');
    }
  };

  return (
    <div className="location-container">
      <div className="location-card">
        <div className="logo-animation">
          <div className="pulse-dot"></div>
          <div className="pulse-ring"></div>
          <FiMapPin className="pin-icon" />
        </div>
        
        <h1 className="welcome-title">Welcome to MindCue</h1>
        <p className="welcome-subtitle">Select your location to personalize your experience</p>

        <div className={`search-container ${isFocused ? 'focused' : ''}`}>
          <div className="search-input-wrapper">
            <FiMapPin className="search-icon" />
            <input
              type="text"
              placeholder="Search for your city"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              list="city-options"
              className="location-input"
            />
            {isLoading && <FiLoader className="spinner" />}
          </div>
          
          <datalist id="city-options">
            {cities.map((city, idx) => (
              <option key={idx} value={city} />
            ))}
          </datalist>
        </div>

        <button 
          onClick={handleContinue} 
          className={`continue-button ${selectedCity ? 'active' : ''}`}
          disabled={!selectedCity}
        >
          Continue
          <FiChevronRight className="button-icon" />
        </button>
      </div>
    </div>
  );
};

export default LocationSelect;