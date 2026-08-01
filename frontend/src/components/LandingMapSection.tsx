"use client";

import { useEffect, useMemo, useState } from "react";
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

function sampleEvenly(items: Sample[], max: number): Sample[] {
  if (items.length <= max) return items;
  const step = items.length / max;
  const result: Sample[] = [];
  for (let i = 0; i < max; i++) {
    result.push(items[Math.floor(i * step)]);
  }
  return result;
}

export default function LandingMapSection() {
  const [points, setPoints] = useState<Sample[]>(MOCK_SAMPLES);
  const [loading, setLoading] = useState(true);
  const heroPoints = useMemo(() => sampleEvenly(points, 8000), [points]);

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
        className="scroll-mt-16 border-b border-[var(--line)] py-12 sm:py-16 md:py-20"
      >
        <div
          className={`${INNER} grid items-center gap-8 md:grid-cols-[1.15fr_1fr] md:gap-10 lg:gap-14`}
        >
          <Reveal>
            <div className="relative order-1 aspect-[4/3] overflow-hidden border border-[var(--line)] bg-[var(--panel)] md:order-none md:min-h-[360px] md:aspect-auto md:h-full">
              <HeatMap points={heroPoints} loading={loading} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0">
                <div className="anomaly-bar" />
                <div className="flex justify-between bg-[color-mix(in_srgb,var(--void)_80%,transparent)] px-3 py-2 font-mono text-[10px] text-[var(--ash)]">
                  <span>pérdida</span>
                  <span>neutral</span>
                  <span>acumulación</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="order-2 flex flex-col gap-5 md:order-none">
            <div className="flex flex-col gap-4">
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
            </div>
            <div>
              <Link href="/dashboard" className="cta-primary">
                Abrir dashboard
              </Link>
            </div>
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="section-eyebrow">Explorador cartográfico</h2>
                <p className="mt-3 font-serif text-2xl text-[var(--neutral)]">
                  Distribución espacial de diferencia_biomasa en la grilla.
                </p>
              </div>
              <Link href="/dashboard" className="cta-secondary shrink-0">
                Abrir a pantalla completa
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
