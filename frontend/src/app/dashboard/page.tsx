"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import DepartmentFilter from "@/components/DepartmentFilter";
import StatsPanel from "@/components/StatsPanel";
import DownloadButton from "@/components/DownloadButton";
import Legend from "@/components/Legend";
import { fetchSnapshotPoints, fetchSnapshotStats } from "@/lib/api";
import { MOCK_SAMPLES, MOCK_STATS } from "@/lib/mockData";
import { DepartamentoFiltro, Sample, StatsResponse } from "@/lib/types";

const HeatMap = dynamic(() => import("@/components/HeatMap"), { ssr: false });

export default function Dashboard() {
  const [departamento, setDepartamento] = useState<DepartamentoFiltro>("Todos");
  const [panelOpen, setPanelOpen] = useState(false);
  const [allPoints, setAllPoints] = useState<Sample[]>(MOCK_SAMPLES);
  const [statsByDepto, setStatsByDepto] = useState<Record<string, StatsResponse>>({
    Todos: MOCK_STATS,
  });
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [usingMock, setUsingMock] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingPoints(true);
    setError(null);

    Promise.all([fetchSnapshotPoints(), fetchSnapshotStats()])
      .then(([pointsData, statsData]) => {
        if (cancelled) return;
        setAllPoints(pointsData);
        setStatsByDepto(statsData);
        setUsingMock(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("No se pudo cargar el dataset. Mostrando datos de ejemplo.");
        setUsingMock(true);
        setAllPoints(MOCK_SAMPLES);
        setStatsByDepto({ Todos: MOCK_STATS });
      })
      .finally(() => {
        if (!cancelled) setLoadingPoints(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const points = useMemo(
    () =>
      departamento === "Todos"
        ? allPoints
        : allPoints.filter((p) => p.departamento === departamento),
    [allPoints, departamento]
  );

  const stats = statsByDepto[departamento] ?? statsByDepto.Todos ?? MOCK_STATS;

  return (
    <div className="flex h-dvh w-full flex-col bg-neutral-950">
      <header className="flex items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-900 px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="shrink-0 text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-100"
          >
            ← Inicio
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-neutral-100 sm:text-lg">
              Criticalidad en Datos — Oriente Boliviano
            </h1>
            <p className="hidden text-xs text-neutral-500 sm:block">
              Biomasa / NDVI por punto — Santa Cruz, Beni y Pando
            </p>
          </div>
        </div>
        {usingMock && (
          <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-1 text-[10px] font-medium text-amber-300 sm:px-3 sm:text-xs">
            {error ?? "Usando datos de ejemplo"}
          </span>
        )}
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        <aside
          className={`${panelOpen ? "flex" : "hidden"} absolute inset-x-0 bottom-0 z-[1100] max-h-[70dvh] flex-col gap-6 overflow-y-auto rounded-t-2xl border-t border-neutral-800 bg-neutral-900 p-4 pb-6 shadow-2xl md:static md:z-auto md:flex md:max-h-none md:w-80 md:flex-shrink-0 md:rounded-none md:border-r md:border-t-0 md:shadow-none`}
        >
          <div className="flex items-center justify-between md:hidden">
            <h2 className="text-sm font-semibold text-neutral-100">
              Filtros y estadísticas
            </h2>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="rounded border border-neutral-700 px-2.5 py-1 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-100"
            >
              ✕ Cerrar
            </button>
          </div>
          <DepartmentFilter value={departamento} onChange={setDepartamento} />
          <DownloadButton departamento={departamento} />
          <StatsPanel stats={stats} departamento={departamento} />
        </aside>

        <main className="relative flex-1">
          <HeatMap points={points} loading={loadingPoints} />
          <Legend />
        </main>

        {!panelOpen && (
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="absolute bottom-4 left-4 z-[1100] rounded-full bg-[#c08457] px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg transition-colors hover:bg-[#cd9269] md:hidden"
          >
            Filtros y estadísticas
          </button>
        )}
      </div>
    </div>
  );
}
