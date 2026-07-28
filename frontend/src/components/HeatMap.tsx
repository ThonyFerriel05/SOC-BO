"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Sample } from "@/lib/types";
import { biomassColor } from "@/lib/color";

const BOLIVIA_ORIENTE_CENTER: [number, number] = [-15.5, -64.5];
const INITIAL_ZOOM = 6;

/** Tamaño nominal de celda para el radio visual (~1 km). */
const GRID_METERS = 1000;
/** Bajo este zoom se muestra una muestra densa (sin celdas agregadas). */
const OVERVIEW_MAX_ZOOM = 8;
const OVERVIEW_MAX_POINTS = 20000;
const DETAIL_MAX_POINTS = 15000;
const MIN_RADIUS_PX = 1.5;
const MAX_RADIUS_PX = 8;

const METERS_PER_PIXEL_AT_EQUATOR = 156543.03392;

const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const CARTO_ATTRIBUTION = `${OSM_ATTRIBUTION} &copy; <a href="https://carto.com/attributions">CARTO</a>`;

const BASEMAPS = {
  claro: {
    label: "Mapa oscuro",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: CARTO_ATTRIBUTION,
  },
  oscuro: {
    label: "Mapa claro",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: CARTO_ATTRIBUTION,
  },
} as const;

type BasemapTheme = keyof typeof BASEMAPS;

function metersPerPixel(zoom: number, lat: number): number {
  return (
    (METERS_PER_PIXEL_AT_EQUATOR * Math.cos((lat * Math.PI) / 180)) / 2 ** zoom
  );
}

/** Radio en pixeles cercano al tamaño real de la celda, con limites para overview. */
function radiusForZoom(zoom: number, lat: number, overview: boolean): number {
  const ideal = GRID_METERS / 2 / metersPerPixel(zoom, lat);
  if (overview) {
    // Puntos chicos y algo solapados: se lee como superficie continua.
    return Math.max(1.6, Math.min(3.5, ideal));
  }
  return Math.max(MIN_RADIUS_PX, Math.min(MAX_RADIUS_PX, ideal));
}

function sampleEvenly<T>(items: T[], max: number): T[] {
  if (items.length <= max) return items;
  const step = items.length / max;
  const result: T[] = [];
  for (let i = 0; i < max; i++) {
    result.push(items[Math.floor(i * step)]);
  }
  return result;
}

function filterByBounds(points: Sample[], bounds: LatLngBounds): Sample[] {
  const padLat = (bounds.getNorth() - bounds.getSouth()) * 0.25;
  const padLon = (bounds.getEast() - bounds.getWest()) * 0.25;
  const south = bounds.getSouth() - padLat;
  const north = bounds.getNorth() + padLat;
  const west = bounds.getWest() - padLon;
  const east = bounds.getEast() + padLon;

  return points.filter(
    (p) =>
      p.lat >= south && p.lat <= north && p.lon >= west && p.lon <= east,
  );
}

type Viewport = { zoom: number; bounds: LatLngBounds | null };

function ViewportWatcher({
  onChange,
}: {
  onChange: (viewport: Viewport) => void;
}) {
  const map = useMap();

  useMapEvents({
    zoomend: () => onChange({ zoom: map.getZoom(), bounds: map.getBounds() }),
    moveend: () => onChange({ zoom: map.getZoom(), bounds: map.getBounds() }),
  });

  useEffect(() => {
    onChange({ zoom: map.getZoom(), bounds: map.getBounds() });
  }, [map, onChange]);

  return null;
}

export default function HeatMap({
  points,
  loading,
}: {
  points: Sample[];
  loading: boolean;
}) {
  const [theme, setTheme] = useState<BasemapTheme>("claro");
  const [viewport, setViewport] = useState<Viewport>({
    zoom: INITIAL_ZOOM,
    bounds: null,
  });
  const basemap = BASEMAPS[theme];
  const overview = viewport.zoom <= OVERVIEW_MAX_ZOOM;

  const markers = useMemo(() => {
    if (overview) {
      return sampleEvenly(points, OVERVIEW_MAX_POINTS);
    }

    const visibles = viewport.bounds
      ? filterByBounds(points, viewport.bounds)
      : points;
    return sampleEvenly(visibles, DETAIL_MAX_POINTS);
  }, [points, overview, viewport.bounds]);

  const latReferencia = viewport.bounds
    ? viewport.bounds.getCenter().lat
    : BOLIVIA_ORIENTE_CENTER[0];
  const radius = radiusForZoom(viewport.zoom, latReferencia, overview);
  const fillOpacity = overview ? 0.85 : 0.9;

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-neutral-950/70 text-sm font-medium text-neutral-200">
          Cargando puntos...
        </div>
      )}
      <button
        type="button"
        onClick={() => setTheme(theme === "oscuro" ? "claro" : "oscuro")}
        className="absolute right-2 top-2 z-[1000] rounded border border-neutral-800 bg-neutral-900/90 px-2 py-1 text-xs font-medium text-neutral-300 shadow-lg transition-colors hover:border-neutral-600 hover:text-neutral-100"
      >
        {basemap.label}
      </button>
      <MapContainer
        center={BOLIVIA_ORIENTE_CENTER}
        zoom={INITIAL_ZOOM}
        preferCanvas
        className="h-full w-full"
      >
        <TileLayer
          key={theme}
          attribution={basemap.attribution}
          url={basemap.url}
        />
        <ViewportWatcher onChange={setViewport} />
        {markers.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lon]}
            radius={radius}
            pathOptions={{
              color: biomassColor(p.diferencia_biomasa),
              fillColor: biomassColor(p.diferencia_biomasa),
              fillOpacity,
              weight: 0,
            }}
          >
            {!overview && (
              <Tooltip direction="top" opacity={0.95}>
                <div className="text-xs">
                  <strong>{p.municipio}</strong> ({p.departamento})
                  <br />Δ biomasa: {p.diferencia_biomasa.toFixed(4)}
                </div>
              </Tooltip>
            )}
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-[1000] hidden rounded border border-neutral-800 bg-neutral-900/90 px-2 py-1 text-xs text-neutral-300 shadow-lg md:block">
        {overview ? (
          <>
            Vista general · {markers.length.toLocaleString()} de{" "}
            {points.length.toLocaleString()} puntos · acercá para detalle
          </>
        ) : (
          <>
            {markers.length.toLocaleString()} puntos en vista ·{" "}
            {points.length.toLocaleString()} en total
          </>
        )}
      </div>
    </div>
  );
}
