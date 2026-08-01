"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Legend from "@/components/Legend";
import Reveal from "@/components/Reveal";
import { fetchSnapshotPoints } from "@/lib/api";
import { MOCK_SAMPLES } from "@/lib/mockData";
import { Sample } from "@/lib/types";

const HeatMap = dynamic(() => import("@/components/HeatMap"), { ssr: false });

const INNER =
  "mx-auto w-full max-w-xl px-5 sm:max-w-2xl sm:px-6 md:max-w-4xl lg:max-w-5xl lg:px-8";

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
    <>
      <section
        id="inicio"
        className="scroll-mt-16 border-b border-[var(--line)] py-14 sm:py-20"
      >
        <div className={`${INNER} flex max-w-3xl flex-col gap-5`}>
          <Reveal className="flex flex-col gap-4">
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-[var(--neutral)] md:text-5xl">
              SOC-BO
            </h1>
            <p className="section-eyebrow w-fit">
              Criticalidad autoorganizada en biomasa
            </p>
            <p className="max-w-prose text-base leading-relaxed text-[var(--ash)] md:text-lg">
              Dataset de criticalidad autoorganizada calculado mediante el
              modelo sandpile de Bak-Tang-Wiesenfeld, aplicado a la
              acumulación de biomasa en Santa Cruz, Beni y Pando.
            </p>
            <p className="font-mono text-xs text-[var(--ash)]">
              57 576 puntos · ~1 km · WGS84
            </p>
          </Reveal>
        </div>
      </section>

      <section
        id="explorador"
        className="scroll-mt-16 border-b border-[var(--line)] bg-[var(--panel)] py-12 sm:py-16"
      >
        <div className={`${INNER} flex flex-col gap-5`}>
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="section-eyebrow">Explorador cartográfico</h2>
                <p className="mt-3 font-serif text-2xl text-[var(--neutral)]">
                  Distribución espacial de diferencia_biomasa en la grilla.
                </p>
              </div>
              <Link href="/dashboard" className="cta-primary shrink-0">
                Abrir dashboard
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <div className="relative h-[55vh] min-h-[320px] w-full overflow-hidden border border-[var(--line)] bg-[var(--void)]">
              <HeatMap points={points} loading={loading} />
              <Legend />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
