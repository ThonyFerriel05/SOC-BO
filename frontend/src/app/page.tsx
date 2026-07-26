"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import DepartmentFilter from "@/components/DepartmentFilter";
import StatsPanel from "@/components/StatsPanel";
import DownloadButton from "@/components/DownloadButton";
import Legend from "@/components/Legend";
import { fetchAllPoints, fetchStats } from "@/lib/api";
import { MOCK_SAMPLES, MOCK_STATS } from "@/lib/mockData";
import { DepartamentoFiltro, Sample, StatsResponse } from "@/lib/types";

const HeatMap = dynamic(() => import("@/components/HeatMap"), { ssr: false });

export default function Home() {
  const [departamento, setDepartamento] = useState<DepartamentoFiltro>("Todos");
  const [points, setPoints] = useState<Sample[]>(MOCK_SAMPLES);
  const [stats, setStats] = useState<StatsResponse | null>(MOCK_STATS);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [usingMock, setUsingMock] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingPoints(true);
    setError(null);

    const depto = departamento === "Todos" ? undefined : departamento;

    Promise.all([fetchAllPoints(depto), fetchStats()])
      .then(([pointsData, statsData]) => {
        if (cancelled) return;
        setPoints(pointsData);
        setStats(statsData);
        setUsingMock(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("No se pudo conectar con la API. Mostrando datos de ejemplo.");
        setUsingMock(true);
        setPoints(MOCK_SAMPLES);
        setStats(MOCK_STATS);
      })
      .finally(() => {
        if (!cancelled) setLoadingPoints(false);
      });

    return () => {
      cancelled = true;
    };
  }, [departamento]);

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-100">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            Criticalidad en Datos — Oriente Boliviano
          </h1>
          <p className="text-xs text-gray-500">
            Biomasa / NDVI por punto — Santa Cruz, Beni y Pando
          </p>
        </div>
        {usingMock && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            {error ?? "Usando datos de ejemplo"}
          </span>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-80 flex-shrink-0 flex-col gap-6 overflow-y-auto border-r border-gray-200 bg-white p-4">
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
