// apiClient.js
// LocationIQ (geocoding) + Open-Meteo (weather)

const GEOCODING_API = "https://us1.locationiq.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

// API key from .env (Vite)
const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

/**
 * Geocode using LocationIQ.
 * Returns a normalized object or null.
 */
export async function geocodeLocation(query) {
  try {
    const url = `${GEOCODING_API}?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(
      query
    )}&format=json&addressdetails=1&limit=5`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error("LocationIQ error status:", res.status);
      return null;
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const bestMatch = data[0];

    return {
      name:
        (bestMatch.address && (bestMatch.address.suburb || bestMatch.address.neighbourhood)) ||
        bestMatch.display_name.split(",")[0],
      district: (bestMatch.address && (bestMatch.address.county || bestMatch.address.district)) || "",
      city:
        (bestMatch.address && (bestMatch.address.city || bestMatch.address.town || bestMatch.address.village)) ||
        "",
      admin1: (bestMatch.address && bestMatch.address.state) || "",
      country: (bestMatch.address && bestMatch.address.country) || "",
      latitude: parseFloat(bestMatch.lat),
      longitude: parseFloat(bestMatch.lon),
    };
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}

/**
 * Fetch weather from Open-Meteo.
 * Requests current_weather=true plus hourly & daily series commonly used.
 * Returns the raw JSON or null.
 */
export async function fetchWeather(latitude, longitude) {
  try {
    // Request current weather + hourly fields + daily summary fields
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current_weather: "true",
      hourly: "temperature_2m,relativehumidity_2m,weathercode",
      daily: "temperature_2m_max,temperature_2m_min,weathercode",
      timezone: "auto",
    });

    const url = `${WEATHER_API}?${params.toString()}`;
    // debug: console.log("[weather] url:", url);
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Open-Meteo error status:", res.status);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Weather API error:", err);
    return null;
  }
}
