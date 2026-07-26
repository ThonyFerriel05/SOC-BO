type Stop = { pos: number; rgb: [number, number, number] };

// Escala divergente anclada en verde: la banda neutral (±0.15, donde cae el ~87%
// de los puntos) se mantiene en un verde medio plano, las pérdidas viran a ocre y
// marrón, y la acumulación fuerte se oscurece hacia el verde profundo. Lo que
// corrige respecto de la escala anterior es que las pérdidas ya no se pintan de
// verde: antes un punto en -0.4 salía del mismo color que uno en 0.
const STOPS: Stop[] = [
  { pos: -1, rgb: [140, 81, 10] },
  { pos: -0.5, rgb: [216, 179, 101] },
  { pos: -0.15, rgb: [134, 185, 106] },
  { pos: 0.15, rgb: [134, 185, 106] },
  { pos: 0.5, rgb: [56, 142, 60] },
  { pos: 1, rgb: [20, 83, 45] },
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
