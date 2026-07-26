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

/** Paso medido de la grilla del dataset: 0.03 grados de latitud. */
const GRID_METERS = 3340;
/** Hasta este zoom la celda de la grilla mide menos de 6 px y los puntos se solapan. */
const AGGREGATION_MAX_ZOOM = 8;
const AGGREGATION_CELL_METERS = 10000;
/** Tope de seguridad para el modo de puntos individuales. */
const MAX_RENDER_POINTS = 15000;
const MIN_RADIUS_PX = 2;
const MAX_RADIUS_PX = 10;

const METERS_PER_PIXEL_AT_EQUATOR = 156543.03392;
const METERS_PER_DEGREE_LAT = 111320;

const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const BASEMAPS = {
  oscuro: {
    label: "Mapa claro",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: `${OSM_ATTRIBUTION} &copy; <a href="https://carto.com/attributions">CARTO</a>`,
  },
  claro: {
    label: "Mapa oscuro",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: OSM_ATTRIBUTION,
  },
} as const;

type BasemapTheme = keyof typeof BASEMAPS;

type MapMarker = {
  key: string;
  lat: number;
  lon: number;
  valor: number;
  /** 1 cuando es un punto real del dataset, >1 cuando es una celda agregada. */
  puntos: number;
  municipio: string;
  departamento: string;
};

function metersPerPixel(zoom: number, lat: number): number {
  return (
    (METERS_PER_PIXEL_AT_EQUATOR * Math.cos((lat * Math.PI) / 180)) / 2 ** zoom
  );
}

/** Radio en pixeles tal que el disco cubra aproximadamente una celda real. */
function radiusForZoom(zoom: number, lat: number, cellMeters: number): number {
  const ideal = cellMeters / 2 / metersPerPixel(zoom, lat);
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

function aggregateToGrid(points: Sample[], cellMeters: number): MapMarker[] {
  const cellDeg = cellMeters / METERS_PER_DEGREE_LAT;
  const cells = new Map<
    string,
    {
      latSum: number;
      lonSum: number;
      valorSum: number;
      count: number;
      departamento: string;
    }
  >();

  for (const p of points) {
    const key = `${Math.floor(p.lat / cellDeg)}:${Math.floor(p.lon / cellDeg)}`;
    const cell = cells.get(key);
    if (cell) {
      cell.latSum += p.lat;
      cell.lonSum += p.lon;
      cell.valorSum += p.diferencia_biomasa;
      cell.count += 1;
    } else {
      cells.set(key, {
        latSum: p.lat,
        lonSum: p.lon,
        valorSum: p.diferencia_biomasa,
        count: 1,
        departamento: p.departamento,
      });
    }
  }

  return Array.from(cells, ([key, cell]) => ({
    key,
    lat: cell.latSum / cell.count,
    lon: cell.lonSum / cell.count,
    valor: cell.valorSum / cell.count,
    puntos: cell.count,
    municipio: "",
    departamento: cell.departamento,
  }));
}

function toMarker(p: Sample): MapMarker {
  return {
    key: p.id,
    lat: p.lat,
    lon: p.lon,
    valor: p.diferencia_biomasa,
    puntos: 1,
    municipio: p.municipio,
    departamento: p.departamento,
  };
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
  const [theme, setTheme] = useState<BasemapTheme>("oscuro");
  const [viewport, setViewport] = useState<Viewport>({
    zoom: INITIAL_ZOOM,
    bounds: null,
  });
  const basemap = BASEMAPS[theme];

  const agregado = viewport.zoom <= AGGREGATION_MAX_ZOOM;

  const markers = useMemo(() => {
    if (agregado) return aggregateToGrid(points, AGGREGATION_CELL_METERS);

    const bounds = viewport.bounds;
    if (!bounds) return sampleEvenly(points, MAX_RENDER_POINTS).map(toMarker);

    // Margen extra para que al desplazar el mapa no aparezcan bordes vacios.
    const padLat = (bounds.getNorth() - bounds.getSouth()) * 0.25;
    const padLon = (bounds.getEast() - bounds.getWest()) * 0.25;
    const south = bounds.getSouth() - padLat;
    const north = bounds.getNorth() + padLat;
    const west = bounds.getWest() - padLon;
    const east = bounds.getEast() + padLon;

    const visibles = points.filter(
      (p) =>
        p.lat >= south && p.lat <= north && p.lon >= west && p.lon <= east,
    );
    return sampleEvenly(visibles, MAX_RENDER_POINTS).map(toMarker);
  }, [points, agregado, viewport.bounds]);

  const latReferencia = viewport.bounds
    ? viewport.bounds.getCenter().lat
    : BOLIVIA_ORIENTE_CENTER[0];
  const radius = radiusForZoom(
    viewport.zoom,
    latReferencia,
    agregado ? AGGREGATION_CELL_METERS : GRID_METERS,
  );

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
        {/* La atribución solo se aplica al montar, por eso el remount con key. */}
        <TileLayer
          key={theme}
          attribution={basemap.attribution}
          url={basemap.url}
        />
        <ViewportWatcher onChange={setViewport} />
        {markers.map((m) => (
          <CircleMarker
            key={m.key}
            center={[m.lat, m.lon]}
            radius={radius}
            pathOptions={{
              color: biomassColor(m.valor),
              fillColor: biomassColor(m.valor),
              fillOpacity: 0.75,
              weight: 0,
            }}
          >
            <Tooltip direction="top" opacity={0.95}>
              <div className="text-xs">
                {m.puntos > 1 ? (
                  <>
                    <strong>{m.puntos.toLocaleString()} puntos</strong> (celda de
                    10 km)
                    <br />Δ biomasa promedio: {m.valor.toFixed(4)}
                  </>
                ) : (
                  <>
                    <strong>{m.municipio}</strong> ({m.departamento})
                    <br />Δ biomasa: {m.valor.toFixed(4)}
                  </>
                )}
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-[1000] rounded border border-neutral-800 bg-neutral-900/90 px-2 py-1 text-xs text-neutral-300 shadow-lg">
        {agregado ? (
          <>
            {markers.length.toLocaleString()} celdas de 10 km ·{" "}
            {points.length.toLocaleString()} puntos · acercá para ver puntos
            individuales
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
