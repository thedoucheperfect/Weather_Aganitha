import React from "react";

export default function DailyList({ days = [] }) {
  if (!days || days.length === 0) return null;

  return (
    <div className="daily-list">
      {days.map((d, idx) => (
        <div className="day-card" key={idx}>
          <div className="day-name">{d.day}</div>
          <div className="day-cond">{d.condition}</div>
          <div className="day-temps">
            <span className="day-min">{d.min}°</span>
            <span className="day-max">{d.max}°</span>
          </div>
        </div>
      ))}
    </div>
  );
}
