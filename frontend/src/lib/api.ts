import { Sample, SamplesResponse, StatsResponse } from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

export async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_URL}/stats`, { cache: "no-store" });
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

export async function fetchAllPoints(departamento?: string): Promise<Sample[]> {
  const search = new URLSearchParams({ format: "json" });
  if (departamento) search.set("departamento", departamento);
  const res = await fetch(`${API_URL}/download?${search.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudo obtener los puntos para el mapa");
  return res.json();
}

export function downloadUrl(format: "csv" | "json", departamento?: string): string {
  const search = new URLSearchParams({ format });
  if (departamento) search.set("departamento", departamento);
  return `${API_URL}/download?${search.toString()}`;
}
