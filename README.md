# 🌟 MindCue

MindCue is a **personalized mood-based recommendation web app** that helps users discover music, activities, and motivational content based on their **location and real-time weather**.  
It is powered by **Ballerina Swan Lake** in the backend and a **React/Node frontend**, delivering a smooth, AI-assisted experience.

---

## 🚀 Features
- 🌦️ **Real-time Weather Integration** – fetches live weather data based on user’s city.
- 🤖 **AI-Powered Suggestions** – personalized recommendations for activities, moods, and self-care.
- 🎶 **Spotify Playlists** – auto-generated playlists based on weather and mood.
- 📍 **Location-Aware** – users can select or auto-detect their city.
- 🎨 **Interactive UI** – clean card-based layout for easy navigation.

---

## 🛠️ Tech Stack
- **Frontend:** React (JavaScript, CSS Animations, Cards-based UI)
- **Backend:** Ballerina Swan Lake (REST APIs for weather + AI recommendations)
- **APIs Used:** OpenWeather API, Spotify API
- **Other Tools:** Node.js, npm, GitHub

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Ballerina Swan Lake](https://ballerina.io/downloads/)
- [Git](https://git-scm.com/)

### Clone the Repository
```bash
git clone https://github.com/your-username/mindcue.git
cd mindcue

### Frontend set up
cd frontend
npm install
npm start

### Backend
cd backend
bal run 
(to run separate modules) 
bal run recommendation.bal
bal run weather.bal
bal run news.bal
