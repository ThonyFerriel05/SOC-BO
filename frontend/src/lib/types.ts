export interface Sample {
  id: string;
  departamento: string;
  municipio: string;
  lat: number;
  lon: number;
  diferencia_biomasa: number;
}

export interface SamplesResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: Sample[];
}

export interface DepartamentoStat {
  departamento: string;
  promedio: number;
  count: number;
}

export interface MunicipioStat {
  municipio: string;
  departamento: string;
  promedio: number;
  count: number;
}

export interface StatsResponse {
  total_puntos: number;
  promedio_global: number;
  max_diferencia_biomasa: number;
  min_diferencia_biomasa: number;
  por_departamento: DepartamentoStat[];
  por_municipio: MunicipioStat[];
  top_riesgo: Sample[];
}

export const DEPARTAMENTOS = ["Todos", "Santa Cruz", "Beni", "Pando"] as const;
export type DepartamentoFiltro = (typeof DEPARTAMENTOS)[number];
