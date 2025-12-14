import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/map.css";

const supplierIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [28, 46],
  iconAnchor: [14, 46]
});

const MapEvents = ({ setSearchPoint }) => {
  useMapEvents({
    click(e) {
      setSearchPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
};

const MapView = ({ suppliers = [], searchPoint, setSearchPoint }) => {
  const [currentPos, setCurrentPos] = useState(null);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const point = { lat: latitude, lng: longitude };
        setCurrentPos(point);
        setSearchPoint(point);
      },
      (err) => {
        console.error(err);
        alert("Unable to get location");
      }
    );
  };

  useEffect(() => {
    detectLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const center = searchPoint || currentPos || { lat: 20.5937, lng: 78.9629 };

  return (
    <div className="rb-map-wrapper">
      <button className="rb-btn-secondary rb-map-gps" onClick={detectLocation}>
        Use Current Location
      </button>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={6}
        scrollWheelZoom
        className="rb-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents setSearchPoint={setSearchPoint} />

        {currentPos && (
          <Marker position={[currentPos.lat, currentPos.lng]}>
            <Popup>Your location</Popup>
          </Marker>
        )}

        {suppliers.map((s) => {
          if (
            !s.location ||
            !Array.isArray(s.location.coordinates) ||
            s.location.coordinates.length !== 2
          ) {
            return null;
          }
          const [lng, lat] = s.location.coordinates;
          return (
            <Marker key={s._id} icon={supplierIcon} position={[lat, lng]}>
              <Popup>
                <strong>{s.shopName}</strong>
                <br />
                {s.address}
                <br />
                {s.phoneNumber}
                <br />
                {s.distanceKm && <>Distance: {s.distanceKm.toFixed(1)} km</>}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
