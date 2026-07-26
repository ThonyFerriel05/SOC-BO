import { Sample, StatsResponse } from "./types";

export const MOCK_SAMPLES: Sample[] = [
  { id: "mock-1", departamento: "Santa Cruz", municipio: "Warnes", lat: -17.5, lon: -63.16, diferencia_biomasa: 0.42 },
  { id: "mock-2", departamento: "Santa Cruz", municipio: "Camiri", lat: -20.03, lon: -63.53, diferencia_biomasa: -0.31 },
  { id: "mock-3", departamento: "Santa Cruz", municipio: "San Julián", lat: -16.9, lon: -62.7, diferencia_biomasa: 0.61 },
  { id: "mock-4", departamento: "Beni", municipio: "Trinidad", lat: -14.83, lon: -64.9, diferencia_biomasa: -0.18 },
  { id: "mock-5", departamento: "Beni", municipio: "Riberalta", lat: -10.98, lon: -66.06, diferencia_biomasa: 0.55 },
  { id: "mock-6", departamento: "Beni", municipio: "Reyes", lat: -14.29, lon: -67.35, diferencia_biomasa: 0.28 },
  { id: "mock-7", departamento: "Pando", municipio: "Cobija", lat: -11.02, lon: -68.77, diferencia_biomasa: 0.09 },
  { id: "mock-8", departamento: "Pando", municipio: "Filadelfia", lat: -11.35, lon: -68.9, diferencia_biomasa: -0.12 },
];

export const MOCK_STATS: StatsResponse = {
  total_puntos: MOCK_SAMPLES.length,
  promedio_global: 0.17,
  max_diferencia_biomasa: 0.61,
  min_diferencia_biomasa: -0.31,
  por_departamento: [
    { departamento: "Beni", promedio: 0.217, count: 3 },
    { departamento: "Pando", promedio: -0.015, count: 2 },
    { departamento: "Santa Cruz", promedio: 0.24, count: 3 },
  ],
  por_municipio: [],
  top_riesgo: [...MOCK_SAMPLES].sort((a, b) => b.diferencia_biomasa - a.diferencia_biomasa),
};
