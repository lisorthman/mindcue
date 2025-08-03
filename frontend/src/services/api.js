// src/services/api.js
const BASE_URL = "http://localhost:9090";

export const fetchRecommendations = async (mood) => {
  const res = await fetch(`${BASE_URL}/recommendation?mood=${mood}`);
  return await res.json();
};
