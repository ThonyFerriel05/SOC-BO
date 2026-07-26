"""Genera un snapshot estatico del dataset real para la demo del frontend.

Lee backend/samples.db (la misma base que sirve la API) y escribe dos JSON en
frontend/public/snapshot/. Los agregados replican exactamente la logica de
/stats en main.py para que los numeros coincidan con la API en vivo.

Uso:  python make_snapshot.py
"""

import json
import sqlite3
from pathlib import Path

BASE = Path(__file__).parent
DB_PATH = BASE / "samples.db"
OUT_DIR = BASE.parent / "frontend" / "public" / "snapshot"

DEPARTAMENTOS = ["Santa Cruz", "Beni", "Pando"]
COORD_DECIMALS = 6
VALUE_DECIMALS = 6


def row_to_dict(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "departamento": row["departamento"],
        "municipio": row["municipio"],
        "lat": round(row["lat"], COORD_DECIMALS),
        "lon": round(row["lon"], COORD_DECIMALS),
        "diferencia_biomasa": round(row["diferencia_biomasa"], VALUE_DECIMALS),
    }


def build_where(departamento):
    if departamento:
        return "WHERE departamento = ?", [departamento]
    return "", []


def compute_stats(conn: sqlite3.Connection, departamento):
    where_sql, params = build_where(departamento)

    total_puntos = conn.execute(
        f"SELECT COUNT(*) FROM samples {where_sql}", params
    ).fetchone()[0]
    promedio_global = conn.execute(
        f"SELECT AVG(diferencia_biomasa) FROM samples {where_sql}", params
    ).fetchone()[0]
    max_val = conn.execute(
        f"SELECT MAX(diferencia_biomasa) FROM samples {where_sql}", params
    ).fetchone()[0]
    min_val = conn.execute(
        f"SELECT MIN(diferencia_biomasa) FROM samples {where_sql}", params
    ).fetchone()[0]

    # Siempre global, igual que el backend: sirve de comparacion entre deptos.
    por_departamento = conn.execute(
        """
        SELECT departamento, AVG(diferencia_biomasa) AS promedio, COUNT(*) AS count
        FROM samples
        GROUP BY departamento
        ORDER BY departamento
        """
    ).fetchall()

    por_municipio = conn.execute(
        f"""
        SELECT municipio, departamento, AVG(diferencia_biomasa) AS promedio, COUNT(*) AS count
        FROM samples
        {where_sql}
        GROUP BY municipio, departamento
        ORDER BY promedio DESC
        """,
        params,
    ).fetchall()

    top_riesgo = conn.execute(
        f"SELECT * FROM samples {where_sql} ORDER BY diferencia_biomasa DESC LIMIT 50",
        params,
    ).fetchall()

    return {
        "total_puntos": total_puntos,
        "promedio_global": promedio_global if promedio_global is not None else 0.0,
        "max_diferencia_biomasa": max_val if max_val is not None else 0.0,
        "min_diferencia_biomasa": min_val if min_val is not None else 0.0,
        "por_departamento": [dict(r) for r in por_departamento],
        "por_municipio": [dict(r) for r in por_municipio],
        "top_riesgo": [row_to_dict(r) for r in top_riesgo],
    }


def main() -> None:
    if not DB_PATH.exists():
        raise FileNotFoundError(f"No se encontro la base en {DB_PATH}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    rows = conn.execute("SELECT * FROM samples ORDER BY id").fetchall()
    points = [row_to_dict(r) for r in rows]

    stats = {"Todos": compute_stats(conn, None)}
    for depto in DEPARTAMENTOS:
        stats[depto] = compute_stats(conn, depto)

    conn.close()

    points_path = OUT_DIR / "points.json"
    stats_path = OUT_DIR / "stats.json"
    with open(points_path, "w", encoding="utf-8") as f:
        json.dump(points, f, ensure_ascii=False, separators=(",", ":"))
    with open(stats_path, "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, separators=(",", ":"))

    print(f"points.json: {len(points)} puntos -> {points_path}")
    print(f"stats.json : {list(stats)} -> {stats_path}")
    print(f"  total (Todos): {stats['Todos']['total_puntos']}")
    for depto in DEPARTAMENTOS:
        s = stats[depto]
        print(
            f"  {depto:<12} n={s['total_puntos']:<6} "
            f"prom={s['promedio_global']:.4f} "
            f"min={s['min_diferencia_biomasa']:.4f} "
            f"max={s['max_diferencia_biomasa']:.4f}"
        )


if __name__ == "__main__":
    main()
