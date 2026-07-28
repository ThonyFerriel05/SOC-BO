"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Legend from "@/components/Legend";
import { fetchSnapshotPoints } from "@/lib/api";
import { MOCK_SAMPLES } from "@/lib/mockData";
import { Sample } from "@/lib/types";

const HeatMap = dynamic(() => import("@/components/HeatMap"), { ssr: false });

export default function LandingMapSection() {
  const [points, setPoints] = useState<Sample[]>(MOCK_SAMPLES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSnapshotPoints()
      .then((data) => {
        if (!cancelled) setPoints(data);
      })
      .catch(() => {
        if (!cancelled) setPoints(MOCK_SAMPLES);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="flex w-full flex-col gap-3">
      <div className="mx-auto flex w-full max-w-xl items-end justify-between gap-4 px-5 sm:max-w-2xl sm:px-6 md:max-w-4xl lg:max-w-5xl lg:px-8">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#c08457]">
            Explorador cartográfico
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Distribución espacial de diferencia_biomasa en la grilla.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="shrink-0 text-sm text-neutral-300 underline decoration-neutral-600 underline-offset-4 transition-colors hover:text-[#c08457] hover:decoration-[#c08457]"
        >
          Abrir a pantalla completa
        </Link>
      </div>
      <div className="relative mx-auto h-[55vh] min-h-[320px] w-full max-w-xl overflow-hidden border-y border-neutral-800 sm:max-w-2xl md:max-w-4xl md:border md:border-neutral-800 lg:max-w-5xl">
        <HeatMap points={points} loading={loading} />
        <Legend />
      </div>
    </section>
  );
}
