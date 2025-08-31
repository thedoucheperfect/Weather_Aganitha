import React from "react";

export default function LocationPreview({ location }) {
  if (!location) return null;

  return (
    <div className="location-preview">
      <div className="location-name">{location.label}</div>
      {location.lat && location.lon && (
        <div className="location-coords">
          Lat: {location.lat.toFixed(4)}, Lon: {location.lon.toFixed(4)}
        </div>
      )}
    </div>
  );
}
