"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Default fix for missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Define a single custom icon (blue in this case)
const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapWithMarkers = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/csv_json/dieythinseis_anelkistires.json");
      if (!response.ok) throw new Error("JSON not found");

      const json = await response.json();

      const cleanedEntries = json.map((entry) => ({
        latitude: parseFloat(entry.Latitude),
        longitude: parseFloat(entry.Longitude),
        station: entry.Σταθμός,
        points: entry.Σημεία,
        direction: entry["Κατεύθυνση προς"],
        info: entry.Πληροφορίες,
      }));

      setFilteredData(cleanedEntries);
    } catch (err) {
      setError("Failed to load data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const defaultCenter = [37.947, 23.643]; // Example coordinates, change to a more appropriate default

  if (loading) return <p>Loading map...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="flex flex-col items-center justify-center w-full md:w-[85%] mx-auto mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Δίκτυο Ανελκυστήρων
        </h1>
        <p className="text-gray-600 mb-4 text-center w-[90%] md:w-[70%]">
          Το δίκτυο ανελκυστήρων της Αττικής είναι ένα από τα πιο εκτενή και
          σύγχρονα δίκτυα στην Ευρώπη. Αποτελείται από 20 σταθμούς και 40
          ανελκυστήρες, οι οποίοι εξυπηρετούν καθημερινά χιλιάδες επιβάτες.
        </p>
      </div>
      <div className="flex flex-col-reverse md:flex-row md:justify-center items-center py-5">
        <MapContainer
          center={
            filteredData.length > 0
              ? [filteredData[0].latitude, filteredData[0].longitude]
              : defaultCenter
          }
          zoom={13}
          className="rounded-xl shadow-md h-[65vh] md:h-[75vh] w-full md:w-[85%] mx-auto"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredData.map((entry, index) => (
            <Marker
              key={`marker-${index}`}
              position={[entry.latitude, entry.longitude]}
              icon={blueIcon} // Using the blueIcon for all markers
            >
              <Popup>
                <div>
                  <strong>{entry.station}</strong>
                  <br />
                  <em>{entry.points}</em>
                  <br />
                  {entry.info}
                  <br />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${entry.latitude},${entry.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Δείτε στο Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapWithMarkers;
