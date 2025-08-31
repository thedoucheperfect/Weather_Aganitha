// utils.js
// Helper functions for formatting weather data

/**
 * Map Open-Meteo weather codes to descriptions & emoji/icons
 * Full list: https://open-meteo.com/en/docs
 */
export function getWeatherDescription(code) {
  const weatherMap = {
    0: "☀️ Clear sky",
    1: "🌤️ Mainly clear",
    2: "⛅ Partly cloudy",
    3: "☁️ Overcast",
    45: "🌫️ Fog",
    48: "🌫️ Depositing rime fog",
    51: "🌦️ Light drizzle",
    53: "🌦️ Moderate drizzle",
    55: "🌧️ Dense drizzle",
    61: "🌦️ Slight rain",
    63: "🌧️ Moderate rain",
    65: "🌧️ Heavy rain",
    71: "🌨️ Slight snow",
    73: "🌨️ Moderate snow",
    75: "❄️ Heavy snow",
    80: "🌦️ Rain showers",
    81: "🌧️ Rain showers",
    82: "🌧️ Violent rain showers",
    95: "⛈️ Thunderstorm",
    96: "⛈️ Thunderstorm with hail",
    99: "⛈️ Severe thunderstorm with hail"
  };

  return weatherMap[code] || "🌍 Unknown";
}

/**
 * Format location name with fallback 
 * Prefers: colony/locality → district → city → state → country
 */
export function formatLocationName(location) {
  if (!location) return "Unknown Location";

  return [
    location.name,                       // colony/locality if available
    location.district || "",             // district
    location.city || location.admin1 || "", // city/state fallback
    location.country
  ]
    .filter(Boolean)
    .join(", ");
}
