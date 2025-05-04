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

// --- Define custom icons ---
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

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const violetIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const orangeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
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
  const [visibleBars, setVisibleBars] = useState({
    "ΣΗΜΕΙΟ ΛΙΑΝΙΚΗΣ": true,
    "ΑΜΕΚ ΤΡΑΜ": true,
    "ΑΜΕΚ ΟΣΥ": true,
    "ΣΤΑΘΜΟΣ ΜΕΤΡΟ": true,
    "ΕΚΔΟΤΗΡΙΟ ΟΣΥ": true,
  });

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/csv_json/diktyo_polisis_active.json");
      if (!response.ok) throw new Error("JSON not found");

      const json = await response.json();

      const cleanedEntries = json.map((entry) => ({
        X: entry.X,
        Y: entry.Y,
        FID: entry.FID,
        geocode: entry.geocode,
        uploadadd: entry.uploadadd,
        shmeio: entry.shmeio,
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

  const defaultCenter = [38.0, 23.7];

  if (loading) return <p>Loading map...</p>;
  if (error) return <p>{error}</p>;

  const getIconForEntry = (shmeio) => {
    if (shmeio.includes("ΣΗΜΕΙΟ ΛΙΑΝΙΚΗΣ")) return blueIcon;
    if (shmeio.includes("ΑΜΕΚ ΤΡΑΜ")) return redIcon;
    if (shmeio.includes("ΑΜΕΚ ΟΣΥ")) return greenIcon;
    if (shmeio.includes("ΣΤΑΘΜΟΣ ΜΕΤΡΟ")) return violetIcon;
    if (shmeio.includes("ΕΚΔΟΤΗΡΙΟ ΟΣΥ")) return orangeIcon;
    return new L.Icon.Default(); // fallback to default if no match
  };

  const handleCheckboxChange = (key) => {
    setVisibleBars((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const getColorForEntry = (shmeio) => {
    if (shmeio.includes("ΣΗΜΕΙΟ ΛΙΑΝΙΚΗΣ")) return "#2A81CB";
    if (shmeio.includes("ΑΜΕΚ ΤΡΑΜ")) return "#CB2B3E";
    if (shmeio.includes("ΑΜΕΚ ΟΣΥ")) return "#2AAD27";
    if (shmeio.includes("ΣΤΑΘΜΟΣ ΜΕΤΡΟ")) return "#9C2BCB";
    if (shmeio.includes("ΕΚΔΟΤΗΡΙΟ ΟΣΥ")) return "#CB8427";
    return "gray"; // default color if no match
  };

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
          <br />
          Για περισσότερες πληροφορίες σχετικά με την εφαρμογή, μπορείτε να
          επισκεφθείτε την{" "}
          <a
            href="https://www.oasa.gr/%CE%B5%CE%B9%CF%83%CE%B9%CF%84%CE%AE%CF%81%CE%B9%CE%B1/%CF%83%CE%B7%CE%BC%CE%B5%CE%AF%CE%B1-%CF%80%CF%8E%CE%BB%CE%B7%CF%83%CE%B7%CF%82-%CE%B5%CF%80%CE%B1%CE%BD%CE%B1%CF%86%CF%8C%CF%81%CF%84%CE%B9%CF%83%CE%B7%CF%82/%CF%83%CE%B7%CE%BC%CE%B5%CE%AF%CE%B1-%CE%AD%CE%BA%CE%B4%CE%BF%CF%83%CE%B7%CF%82-%CE%B5%CE%B9%CF%83%CE%B9%CF%84%CE%B7%CF%81%CE%AF%CF%89%CE%BD/"
            className="text-blue-500 underline"
          >
            ιστοσελίδα του ΟΑΣΑ
          </a>
          .
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
                onChange={() => handleCheckboxChange(key)}
                className="accent-blue-600"
              />
              <span className="text-sm">
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: getColorForEntry(key),
                    marginRight: "8px",
                  }}
                ></span>
                {key}
              </span>
            </label>
          ))}
        </div>

        <MapContainer
          center={
            filteredData.length > 0
              ? [filteredData[315].Y, filteredData[315].X]
              : defaultCenter
          }
          zoom={13}
          className="rounded-xl shadow-md h-[65vh]  md:h-[75vh] w-full md:w-[85%] mx-auto"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredData.map(
            (entry) =>
              visibleBars[entry.shmeio] && (
                <Marker
                  key={entry.FID}
                  position={[entry.Y, entry.X]}
                  icon={getIconForEntry(entry.shmeio)}
                >
                  <Popup>
                    <div>
                      <strong>{entry.shmeio}</strong>
                      {/* <p className="text-red-500">{entry.FID}</p> */}
                      <br />
                      {entry.uploadadd}
                    </div>

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
      </div>
    </div>
  );
};

export default MapWithMarkers;
