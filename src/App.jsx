import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import LocationPreview from "./components/LocationPreview";
import CurrentWeather from "./components/CurrentWeather";
import HourlyChart from "./components/HourlyChart";
import DailyList from "./components/DailyList";

import { geocodeLocation, fetchWeather } from "./apiClient";
import { formatLocationName, getWeatherDescription } from "./utils";
import "./styles.css";

export default function App() {
  const [location, setLocation] = useState({
    label: "Delhi, India",
    lat: 28.6139,
    lon: 77.2090,
  });

  const [currentWeather, setCurrentWeather] = useState({
    temp: "30°C",
    condition: "Sunny",
    conditionCode: 1,
    humidity: "45%",
    wind: "10 km/h",
    time: "11:00",
  });

  const [hourly, setHourly] = useState([]);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(false);

  // onSearch(query) from SearchBar
  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const geo = await geocodeLocation(query);
      if (!geo) {
        alert("Location not found. Try a different query (city or district).");
        setLoading(false);
        return;
      }

      const label = formatLocationName({
        name: geo.name,
        admin2: geo.district,
        admin1: geo.admin1,
        country: geo.country,
      });

      setLocation({
        label,
        lat: geo.latitude,
        lon: geo.longitude,
      });

      const weatherJson = await fetchWeather(geo.latitude, geo.longitude);
      if (!weatherJson) {
        alert("Weather fetch failed.");
        setLoading(false);
        return;
      }

      // Determine current weather: prefer current_weather, otherwise derive from hourly[0]
      let cw = null;
      if (weatherJson.current_weather) {
        // Open-Meteo current_weather contains temperature, windspeed, weathercode, time
        const cur = weatherJson.current_weather;
        // humidity may be available in hourly.relativehumidity_2m aligned by time index
        let humidity = "—";
        if (weatherJson.hourly && Array.isArray(weatherJson.hourly.time) && Array.isArray(weatherJson.hourly.relativehumidity_2m)) {
          // find index matching current_weather.time (fallback to 0)
          const idx = weatherJson.hourly.time.indexOf(cur.time);
          const useIdx = idx >= 0 ? idx : 0;
          humidity = weatherJson.hourly.relativehumidity_2m[useIdx] !== undefined
            ? `${Math.round(weatherJson.hourly.relativehumidity_2m[useIdx])}%`
            : "—";
        }

        cw = {
          temp: `${Math.round(cur.temperature)}°C`,
          condition: getWeatherDescription(cur.weathercode).replace(/^[^\s]+\s?/, ""),
          conditionCode: cur.weathercode,
          humidity,
          wind: cur.windspeed ? `${cur.windspeed} km/h` : "—",
          time: cur.time,
        };
      } else if (weatherJson.hourly && Array.isArray(weatherJson.hourly.time) && Array.isArray(weatherJson.hourly.temperature_2m)) {
        // fallback: take first hourly entry as "current"
        const times = weatherJson.hourly.time;
        const temps = weatherJson.hourly.temperature_2m;
        const codes = weatherJson.hourly.weathercode || [];
        const hums = weatherJson.hourly.relativehumidity_2m || [];

        const idx = 0;
        const tIso = times[idx];
        cw = {
          temp: `${Math.round(temps[idx])}°C`,
          condition: getWeatherDescription(codes[idx]).replace(/^[^\s]+\s?/, ""),
          conditionCode: codes[idx],
          humidity: hums[idx] !== undefined ? `${Math.round(hums[idx])}%` : "—",
          wind: "—",
          time: tIso,
        };
      } else {
        cw = null;
      }

      setCurrentWeather(cw);

      // Map hourly -> [{time:"09:00", temp:26}, ...] take up to 24
      if (weatherJson.hourly && Array.isArray(weatherJson.hourly.time) && Array.isArray(weatherJson.hourly.temperature_2m)) {
        const times = weatherJson.hourly.time;
        const temps = weatherJson.hourly.temperature_2m;
        const hourlyArr = times.map((t, i) => {
          const dt = new Date(t);
          const hh = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return { time: hh, temp: Math.round(temps[i]) };
        }).slice(0, 24);
        setHourly(hourlyArr);
      } else {
        setHourly([]);
      }

      // Map daily -> [{day:"Tue", min:22, max:28, condition:"Rain"}]
      if (weatherJson.daily && Array.isArray(weatherJson.daily.time)) {
        const times = weatherJson.daily.time;
        const mins = weatherJson.daily.temperature_2m_min || [];
        const maxs = weatherJson.daily.temperature_2m_max || [];
        const codes = weatherJson.daily.weathercode || [];

        const daysArr = times.map((d, i) => {
          const dayLabel = i === 0 ? "Today" : new Date(d).toLocaleDateString(undefined, { weekday: "short" });
          return {
            day: dayLabel,
            min: mins[i] !== undefined ? Math.round(mins[i]) : "—",
            max: maxs[i] !== undefined ? Math.round(maxs[i]) : "—",
            condition: codes[i] !== undefined ? getWeatherDescription(codes[i]).replace(/^[^\s]+\s?/, "") : "",
          };
        }).slice(0, 7);

        setDaily(daysArr);
      } else {
        setDaily([]);
      }
    } catch (err) {
      console.error("Search / fetch error:", err);
      alert("An error occurred while fetching data. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="panel">
        <h1 className="app-title">Weather Finder</h1>

        <SearchBar onSearch={handleSearch} />

        {loading && <div style={{ textAlign: "center", color: "var(--muted)" }}>Loading…</div>}

        <LocationPreview location={{ label: location.label, lat: location.lat, lon: location.lon }} />

        <CurrentWeather weather={currentWeather} />

        <h3 className="section-title">Hourly</h3>
        <HourlyChart hourly={hourly} />

        <h3 className="section-title">Next days</h3>
        <DailyList days={daily} />
      </div>
    </div>
  );
}
