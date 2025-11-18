"use client";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLE } from "@/constants/constants";

export default function DestinationMap({
  coordinates = [10.18, 36.8],
  zoom = 6,
  markers = [],
  padding = 60,
  maxZoom = 6,
  maintainCenter = true,
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null); // store the map instance

  useEffect(() => {
    if (!mapContainer.current) return;

    // create map
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: coordinates,
      zoom,
    });
    mapRef.current = map;

    // 🔹 ensure resize once visible
    setTimeout(() => map.resize(), 100);


    // additional markers
    markers.forEach((m) =>
      new maplibregl.Marker({ color: "#02365b" })
        .setLngLat(m.coords)
        .setPopup(new maplibregl.Popup().setText(m.label))
        .addTo(map)
    );

    // fit bounds
    const bounds = new maplibregl.LngLatBounds();
    bounds.extend(coordinates);
    markers.forEach((m) => bounds.extend(m.coords));

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding, maxZoom, duration: 500 });
      if (maintainCenter) {
        map.once("moveend", () => {
          const computedZoom = map.getZoom();
          map.setCenter(coordinates);
          map.setZoom(Math.min(computedZoom, maxZoom));
        });
      }
    }

    return () => map.remove();
  }, [coordinates, markers, zoom, padding, maxZoom, maintainCenter]);

  return <div ref={mapContainer} className="w-full h-full min-h-[350px]" />;
}
