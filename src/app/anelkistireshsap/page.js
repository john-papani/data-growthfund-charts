"use client";

import dynamic from "next/dynamic";

// Dynamically import the map component with SSR disabled
const MapWithMarkers = dynamic(
  () => import("../Components/MapWithMarkers_anelkistires"),
  { ssr: false }
);

export default function MapAnelkystiresPage() {
  return (
    <div className="min-h-screen p-4">
      <MapWithMarkers />
    </div>
  );
}
