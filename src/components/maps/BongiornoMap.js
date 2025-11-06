"use client";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLE } from "@/constants/constants";

// Fixed Bongiorno bases with lng,lat
const BASE_MARKERS = [
  { label: "Bongiorno Italia – Gallarate (Milano)", coords: [8.793, 45.66] },
  { label: "Bongiorno Francia – Marsiglia", coords: [5.3698, 43.2965] },
  { label: "Bongiorno Spagna – Barcellona", coords: [2.1734, 41.3851] },
  { label: "Bongiorno Tunisia – Tunisi", coords: [10.1815, 36.8065] },
  { label: "Bongiorno Algeria – Algeri", coords: [3.0588, 36.7538] },
];

export default function BongiornoMap({ padding = 80 }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: [7, 42],
      zoom: 4,
    });

    // Add markers with popup; show on hover and click
    const bounds = new maplibregl.LngLatBounds();

    BASE_MARKERS.forEach((m) => {
      const popup = new maplibregl.Popup({ closeButton: false, closeOnMove: false }).setText(m.label);
      const marker = new maplibregl.Marker({ color: "#02365b" }).setLngLat(m.coords).setPopup(popup).addTo(map);

      const el = marker.getElement();
      el.addEventListener("mouseenter", () => {
        popup.addTo(map);
        popup.setLngLat(m.coords);
      });
      el.addEventListener("mouseleave", () => {
        popup.remove();
      });
      el.addEventListener("click", () => {
        // Toggle popup on click as well
        if (popup.isOpen()) popup.remove();
        else {
          popup.addTo(map);
          popup.setLngLat(m.coords);
        }
      });

      bounds.extend(m.coords);
    });

    // Fit to include all markers nicely
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding, duration: 800, maxZoom: 8 });
    }

    return () => map.remove();
  }, [padding]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
