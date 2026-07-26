import { Sample, SamplesResponse, StatsResponse } from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

export async function fetchStats(departamento?: string): Promise<StatsResponse> {
  const search = new URLSearchParams();
  if (departamento) search.set("departamento", departamento);
  const query = search.toString();

  const res = await fetch(`${API_URL}/stats${query ? `?${query}` : ""}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudo obtener /stats");
  return res.json();
}

export async function fetchSamples(
  params: { page?: number; page_size?: number; departamento?: string } = {}
): Promise<SamplesResponse> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.page_size) search.set("page_size", String(params.page_size));
  if (params.departamento) search.set("departamento", params.departamento);

  const res = await fetch(`${API_URL}/samples?${search.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudo obtener /samples");
  return res.json();
}

export async function fetchSample(id: string): Promise<Sample> {
  const res = await fetch(`${API_URL}/samples/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Punto no encontrado");
  return res.json();
}

// El backend limita page_size a 5000.
const MAP_PAGE_SIZE = 5000;

export async function fetchAllPoints(departamento?: string): Promise<Sample[]> {
  const first = await fetchSamples({
    page: 1,
    page_size: MAP_PAGE_SIZE,
    departamento,
  });
  if (first.total_pages <= 1) return first.items;

  const rest = await Promise.all(
    Array.from({ length: first.total_pages - 1 }, (_, i) =>
      fetchSamples({ page: i + 2, page_size: MAP_PAGE_SIZE, departamento })
    )
  );

  return [...first.items, ...rest.flatMap((page) => page.items)];
}

export function downloadUrl(format: "csv" | "json", departamento?: string): string {
  const search = new URLSearchParams({ format });
  if (departamento) search.set("departamento", departamento);
  return `${API_URL}/download?${search.toString()}`;
}

// Snapshot estatico generado desde la misma base que la API (backend/make_snapshot.py).
// Se sirve desde el CDN de Vercel para que el dashboard cargue al instante en la
// demo, sin depender del cold start de la API en Render.
export async function fetchSnapshotPoints(): Promise<Sample[]> {
  const res = await fetch("/snapshot/points.json", { cache: "force-cache" });
  if (!res.ok) throw new Error("No se pudo cargar el snapshot de puntos");
  return res.json();
}

export async function fetchSnapshotStats(): Promise<Record<string, StatsResponse>> {
  const res = await fetch("/snapshot/stats.json", { cache: "force-cache" });
  if (!res.ok) throw new Error("No se pudo cargar el snapshot de estadísticas");
  return res.json();
}
