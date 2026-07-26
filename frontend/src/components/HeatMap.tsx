"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Sample } from "@/lib/types";
import { biomassColor } from "@/lib/color";

const BOLIVIA_ORIENTE_CENTER: [number, number] = [-15.5, -64.5];
const MAX_RENDER_POINTS = 15000;

function sampleEvenly<T>(items: T[], max: number): T[] {
  if (items.length <= max) return items;
  const step = items.length / max;
  const result: T[] = [];
  for (let i = 0; i < max; i++) {
    result.push(items[Math.floor(i * step)]);
  }
  return result;
}

export default function HeatMap({
  points,
  loading,
}: {
  points: Sample[];
  loading: boolean;
}) {
  const rendered = useMemo(() => sampleEvenly(points, MAX_RENDER_POINTS), [points]);

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/70 text-sm font-medium text-gray-700">
          Cargando puntos...
        </div>
      )}
      <MapContainer
        center={BOLIVIA_ORIENTE_CENTER}
        zoom={6}
        preferCanvas
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {rendered.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lon]}
            radius={4}
            pathOptions={{
              color: biomassColor(p.diferencia_biomasa),
              fillColor: biomassColor(p.diferencia_biomasa),
              fillOpacity: 0.75,
              weight: 0,
            }}
          >
            <Tooltip direction="top" opacity={0.95}>
              <div className="text-xs">
                <strong>{p.municipio}</strong> ({p.departamento})
                <br />
                Δ biomasa: {p.diferencia_biomasa.toFixed(4)}
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
      {points.length > MAX_RENDER_POINTS && (
        <div className="absolute bottom-2 left-2 z-[1000] rounded bg-white/90 px-2 py-1 text-xs text-gray-600 shadow">
          Mostrando muestra de {rendered.length.toLocaleString()} de{" "}
          {points.length.toLocaleString()} puntos
        </div>
      )}
    </div>
  );
}
