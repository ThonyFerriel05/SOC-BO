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
    <section
      id="explorador"
      className="scroll-mt-16 border-y border-neutral-800 bg-neutral-900/40 py-10 sm:py-12"
    >
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-5 sm:max-w-2xl sm:px-6 md:max-w-4xl lg:max-w-5xl lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#c08457] px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-[#cd9269]"
          >
            Abrir a pantalla completa
          </Link>
        </div>
        <div className="relative h-[55vh] min-h-[320px] w-full overflow-hidden border border-neutral-800 bg-neutral-950">
          <HeatMap points={points} loading={loading} />
          <Legend />
        </div>
      </div>
    </section>
  );
}
