"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface MapPin {
  lat: number;
  lng: number;
  label: string;
  description?: string;
}

interface InteractiveMapProps {
  pins: MapPin[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export function InteractiveMap({
  pins,
  center = [0.3476, 32.5825],
  zoom = 7,
  height = "500px",
}: InteractiveMapProps) {
  useEffect(() => {
    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }, []);

  return (
    <div style={{ height }} className="rounded-2xl overflow-hidden border border-white/10">
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {pins.map((pin, i) => (
          <Marker key={i} position={[pin.lat, pin.lng]}>
            <Popup>
              <strong>{pin.label}</strong>
              {pin.description && <p className="text-sm mt-1">{pin.description}</p>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
