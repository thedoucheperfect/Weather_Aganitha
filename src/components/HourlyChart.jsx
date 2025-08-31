import React from "react";

/*
  props.hourly = [{ time: "09:00", temp: 26 }, ...]
  This component draws a simple SVG bar chart where bar heights scale to temp range.
*/
export default function HourlyChart({ hourly = [] }) {
  if (!hourly || hourly.length === 0) return null;

  const temps = hourly.map((h) => Number(h.temp));
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const padding = 8;
  const barMaxHeight = 90; // px

  const mapTempToHeight = (t) => {
    if (max === min) return barMaxHeight / 2;
    return ((t - min) / (max - min)) * barMaxHeight;
  };

  const barWidth = Math.max(24, Math.floor(300 / hourly.length));

  return (
    <div className="hourly-chart">
      <div className="hourly-scroll">
        {hourly.map((h, idx) => {
          const height = mapTempToHeight(Number(h.temp));
          return (
            <div className="hour-col" key={idx} style={{ width: barWidth }}>
              <div
                className="hour-bar"
                style={{ height: `${height}px`, marginTop: `${barMaxHeight - height}px` }}
                title={`${h.time} — ${h.temp}°`}
              />
              <div className="hour-label">{h.time}</div>
              <div className="hour-temp">{h.temp}°</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
