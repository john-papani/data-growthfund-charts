"use client";

import dynamic from "next/dynamic";

// Dynamically import the map with SSR disabled
const MapWithMarkers = dynamic(
  () => import("../Components/MapWithMarkers"),
  { ssr: false }
);

export default function MapPage() {
  return (
    <div className="min-h-screen p-4">
      <MapWithMarkers />
    </div>
  );
}
