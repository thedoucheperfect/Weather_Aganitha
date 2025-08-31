import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [colony, setColony] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const parts = [colony, city, stateName, country].map((s) => (s ? s.trim() : "")).filter(Boolean);
    const query = parts.join(", ");
    if (!query) return;
    onSearch(query);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="form-label">Colony / District</label>
        <input
          className="form-input"
          value={colony}
          onChange={(e) => setColony(e.target.value)}
          placeholder="e.g. Andheri West"
        />
      </div>

      <div className="form-row">
        <label className="form-label">City</label>
        <input
          className="form-input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Mumbai"
        />
      </div>

      <div className="two-cols">
        <div className="form-row">
          <label className="form-label">State</label>
          <input
            className="form-input"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            placeholder="e.g. Maharashtra"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Country</label>
          <input
            className="form-input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. India"
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-primary" type="submit">Get Weather</button>
      </div>
    </form>
  );
}
