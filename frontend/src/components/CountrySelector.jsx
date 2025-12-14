import { useEffect, useState } from "react";
import "../styles/home.css";

const CountrySelector = () => {
  const [country, setCountry] = useState(
    localStorage.getItem("rb_country") || "India"
  );
  const [showPopup, setShowPopup] = useState(!localStorage.getItem("rb_country"));

  useEffect(() => {
    localStorage.setItem("rb_country", country);
  }, [country]);

  const handleChange = (e) => setCountry(e.target.value);
  const closePopup = () => setShowPopup(false);

  return (
    <>
      {showPopup && (
        <div className="rb-country-popup">
          <div className="rb-country-popup-inner">
            <h3>Select Country</h3>
            <select value={country} onChange={handleChange}>
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
            </select>
            <button className="rb-btn-primary" onClick={closePopup}>
              Continue
            </button>
          </div>
        </div>
      )}
      <div className="rb-country-inline">
        <span>Country:</span>
        <select value={country} onChange={handleChange}>
          <option>India</option>
          <option>United States</option>
          <option>United Kingdom</option>
        </select>
      </div>
    </>
  );
};

export default CountrySelector;
