import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LocationSelect.css';

const LocationSelect = () => {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();

  const fetchCities = async (input) => {
    try {
      const response = await axios.get(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities`,
        {
          params: { namePrefix: input, limit: 10, sort: '-population' },
          headers: {
            'X-RapidAPI-Key': '0f410021a9msh30cb50860138ac2p1ace31jsn943a466c8e23', // Replace this
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
    }
  };

  useEffect(() => {
    if (query.length > 2) fetchCities(query);
    else setCities([]);
  }, [query]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    // Check if val matches a city in the list exactly
    if (cities.includes(val)) {
      setSelectedCity(val);
    } else {
      setSelectedCity('');
    }
  };

  const handleContinue = () => {
  if (selectedCity) {
    localStorage.setItem('userLocation', selectedCity);
    navigate('/home');  // changed from '/home' to '/entrance'
  } else {
    alert('Please select a city from the list.');
  }
};


  return (
    <div className="location-container">
      <div className="location-card">
        <h1>Welcome to MindCue</h1>
        <p>Select your location to personalize your experience.</p>

        <input
          type="text"
          placeholder="Search for your city"
          value={query}
          onChange={handleInputChange}
          list="city-options"
        />
        <datalist id="city-options">
          {cities.map((city, idx) => (
            <option key={idx} value={city} />
          ))}
        </datalist>

        <button onClick={handleContinue}>Continue</button>
      </div>
    </div>
  );
};

export default LocationSelect;
