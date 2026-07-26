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
    <div className="flex h-screen w-screen flex-col bg-neutral-950">
      <header className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900 px-6 py-3">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-100"
          >
            ← Inicio
          </Link>
          <div>
            <h1 className="text-lg font-bold text-neutral-100">
              Criticalidad en Datos — Oriente Boliviano
            </h1>
            <p className="text-xs text-neutral-500">
              Biomasa / NDVI por punto — Santa Cruz, Beni y Pando
            </p>
          </div>
        </div>
        {usingMock && (
          <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-300">
            {error ?? "Usando datos de ejemplo"}
          </span>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-80 flex-shrink-0 flex-col gap-6 overflow-y-auto border-r border-neutral-800 bg-neutral-900 p-4">
          <DepartmentFilter value={departamento} onChange={setDepartamento} />
          <DownloadButton departamento={departamento} />
          <StatsPanel stats={stats} departamento={departamento} />
        </aside>

        <main className="relative flex-1">
          <HeatMap points={points} loading={loadingPoints} />
          <Legend />
        </main>
      </div>
    </div>
  );
}
