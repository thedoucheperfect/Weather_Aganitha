import React from "react";
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi";

function iconForCondition(cond) {
  // condition can be a string like "Sunny" or a numeric weather code
  if (typeof cond === "number") {
    // simple Open-Meteo mapping
    const code = cond;
    if (code === 0 || code === 1) return <WiDaySunny className="weather-icon" />;
    if (code === 2 || code === 3) return <WiCloud className="weather-icon" />;
    if (code >= 51 && code < 70) return <WiRain className="weather-icon" />;
    if (code >= 71 && code < 80) return <WiSnow className="weather-icon" />;
    if (code >= 95) return <WiThunderstorm className="weather-icon" />;
    return <WiDaySunny className="weather-icon" />;
  }

  switch ((cond || "").toLowerCase()) {
    case "sunny":
    case "clear":
      return <WiDaySunny className="weather-icon" />;
    case "cloudy":
    case "clouds":
      return <WiCloud className="weather-icon" />;
    case "rain":
    case "rainy":
      return <WiRain className="weather-icon" />;
    case "snow":
      return <WiSnow className="weather-icon" />;
    case "thunder":
    case "thunderstorm":
      return <WiThunderstorm className="weather-icon" />;
    default:
      return <WiDaySunny className="weather-icon" />;
  }
}

export default function CurrentWeather({ weather }) {
  if (!weather) return null;

  // weather: { temp, condition, wind, humidity, time }
  return (
    <div className="current-weather">
      <div className="cw-left">
        {iconForCondition(weather.conditionCode ?? weather.condition)}
      </div>
      <div className="cw-right">
        <div className="cw-temp">{weather.temp}</div>
        <div className="cw-cond">{weather.condition}</div>
        <div className="cw-meta">
          <span>💧 {weather.humidity}</span>
          <span> | </span>
          <span>🌬 {weather.wind}</span>
        </div>
        {weather.time && <div className="cw-time">{weather.time}</div>}
      </div>
    </div>
  );
}
