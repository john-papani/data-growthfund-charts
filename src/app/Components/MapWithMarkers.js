"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Spinner from "./Spinner";

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// --- Define custom icons ---
const iconMaker = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const icons = {
  "ΣΗΜΕΙΟ ΛΙΑΝΙΚΗΣ": iconMaker("blue"),
  "ΑΜΕΚ ΤΡΑΜ": iconMaker("red"),
  "ΑΜΕΚ ΟΣΥ": iconMaker("green"),
  "ΣΤΑΘΜΟΣ ΜΕΤΡΟ": iconMaker("violet"),
  "ΕΚΔΟΤΗΡΙΟ ΟΣΥ": iconMaker("orange"),
};

const colors = {
  "ΣΗΜΕΙΟ ΛΙΑΝΙΚΗΣ": "#2A81CB",
  "ΑΜΕΚ ΤΡΑΜ": "#CB2B3E",
  "ΑΜΕΚ ΟΣΥ": "#2AAD27",
  "ΣΤΑΘΜΟΣ ΜΕΤΡΟ": "#9C2BCB",
  "ΕΚΔΟΤΗΡΙΟ ΟΣΥ": "#CB8427",
};

const MapWithMarkers = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleBars, setVisibleBars] = useState(
    Object.fromEntries(Object.keys(icons).map((k) => [k, true]))
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
        const res = await axios.get(
          `${basePath}/csv_json/diktyo_polisis_active.json`
        );
        const json = res.data;
        const cleaned = json.map((entry) => ({
          X: entry.X,
          Y: entry.Y,
          FID: entry.FID,
          geocode: entry.geocode,
          uploadadd: entry.uploadadd,
          shmeio: entry.shmeio,
        }));
        setFilteredData(cleaned);
      } catch (err) {
        setError("Failed to load map data.");
        console.error("Error loading map data:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const defaultCenter = [38.0, 23.7];

  return (
    <div>
      <div className="flex flex-col items-center justify-center w-full md:w-[85%] mx-auto mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Δίκτυο Πωλήσεων Ειστηρίων
        </h1>
        <p className="text-gray-600 mb-4 text-center w-[90%] md:w-[70%]">
          Η εφαρμογή αυτή παρέχει πληροφορίες σχετικά με τα σημεία πώλησης και
          τα εκδοτήρια του δικτύου συγκοινωνιών της Αθήνας. Μπορείτε να
          επιλέξετε ποια σημεία θέλετε να εμφανίζονται στον χάρτη.
        </p>
      </div>

      <div className="flex flex-col-reverse md:flex-row md:justify-center items-center py-5">
        <div className="flex flex-col p-4 bg-gray-100 rounded-xl shadow-md h-fit md:w-fit w-[60%] mt-4">
          <h2 className="text-lg font-semibold text-gray-700">Επιλογή</h2>
          {Object.keys(visibleBars).map((key) => (
            <label key={key} className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                checked={visibleBars[key]}
                onChange={() =>
                  setVisibleBars({ ...visibleBars, [key]: !visibleBars[key] })
                }
                className="accent-blue-600"
              />
              <span className="text-sm">
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: colors[key] || "gray",
                    marginRight: "8px",
                  }}
                ></span>
                {key}
              </span>
            </label>
          ))}
        </div>
        <div className="w-full md:w-[85%] h-[65vh] md:h-[75vh] rounded-xl shadow-md">
          {loading ? (
            <Spinner />
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <MapContainer
              center={
                filteredData.length > 0
                  ? [filteredData[315].Y, filteredData[315].X]
                  : defaultCenter
              }
              zoom={13}
              className="h-full w-full rounded-xl"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {filteredData.map(
                (entry) =>
                  visibleBars[entry.shmeio] && (
                    <Marker
                      key={entry.FID}
                      position={[entry.Y, entry.X]}
                      icon={icons[entry.shmeio] || new L.Icon.Default()}
                    >
                      <Popup>
                        <strong>{entry.shmeio}</strong>
                        <br />
                        {entry.uploadadd}
                        <br />
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${entry.Y},${entry.X}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Δείτε στο Google Maps
                        </a>
                      </Popup>
                    </Marker>
                  )
              )}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapWithMarkers;
