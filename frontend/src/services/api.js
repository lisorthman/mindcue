// src/services/api.js
const BASE_URL = "http://localhost:9090"; // Recommendations API
const NEWS_URL = "http://localhost:9092"; // News API

export const fetchRecommendations = async (mood) => {
  try {
    const res = await fetch(`${BASE_URL}/recommendation?mood=${encodeURIComponent(mood)}`);
    if (!res.ok) throw new Error("Failed to fetch recommendations");
    return await res.json();
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return null;
  }
};

export const fetchSriLankaNews = async () => {
  try {
    const res = await fetch(`${NEWS_URL}/news`);
    if (!res.ok) throw new Error("Failed to fetch news");
    return await res.json();
  } catch (error) {
    console.error("Error fetching news:", error);
    return null;
  }
};
