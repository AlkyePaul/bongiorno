"use client";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLE } from "@/constants/constants";

export default function DestinationMap({ coordinates = [10.18, 36.8], zoom = 6, markers = [] }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: coordinates,
      zoom,
    });

    // Main marker (center)
    new maplibregl.Marker({ color: "#41c7f3" }).setLngLat(coordinates).addTo(map);

    // Additional markers if present
    markers.forEach((m) =>
      new maplibregl.Marker({ color: "#02365b" }).setLngLat(m.coords).setPopup(new maplibregl.Popup().setText(m.label)).addTo(map)
    );

    return () => map.remove();
  }, [coordinates, markers, zoom]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
