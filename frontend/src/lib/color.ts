type Stop = { pos: number; rgb: [number, number, number] };

// Escala divergente tipo anomalía NDVI: rojo (pérdida) → blanco (neutro) →
// verde (acumulación). El centro se ancla en blanco con una banda neutral
// angosta (±0.05) para que las diferencias pequeñas alrededor de 0 se vean, y
// las pérdidas y ganancias fuertes saturen hacia rojo y verde profundo.
const STOPS: Stop[] = [
  { pos: -1, rgb: [165, 0, 38] },
  { pos: -0.5, rgb: [215, 48, 39] },
  { pos: -0.2, rgb: [252, 141, 89] },
  { pos: -0.05, rgb: [255, 255, 255] },
  { pos: 0.05, rgb: [255, 255, 255] },
  { pos: 0.2, rgb: [145, 207, 96] },
  { pos: 0.5, rgb: [49, 163, 84] },
  { pos: 1, rgb: [0, 104, 55] },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function biomassColor(value: number): string {
  const v = Math.max(-1, Math.min(1, value));

  let lower = STOPS[0];
  let upper = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (v >= STOPS[i].pos && v <= STOPS[i + 1].pos) {
      lower = STOPS[i];
      upper = STOPS[i + 1];
      break;
    }
  }

  const range = upper.pos - lower.pos || 1;
  const t = (v - lower.pos) / range;

  const r = Math.round(lerp(lower.rgb[0], upper.rgb[0], t));
  const g = Math.round(lerp(lower.rgb[1], upper.rgb[1], t));
  const b = Math.round(lerp(lower.rgb[2], upper.rgb[2], t));

  return `rgb(${r}, ${g}, ${b})`;
}

// Derivado de STOPS para que la leyenda no pueda desincronizarse del mapa.
export const BIOMASS_GRADIENT_CSS = `linear-gradient(to right, ${STOPS.map(
  ({ pos, rgb }) => `rgb(${rgb.join(", ")}) ${((pos + 1) / 2) * 100}%`
).join(", ")})`;

export const BIOMASS_TICKS = ["-1", "-0.5", "0", "+0.5", "+1"];
