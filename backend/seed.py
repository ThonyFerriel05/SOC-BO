import csv
from pathlib import Path

from database import get_connection, init_db

CSV_PATH = Path(__file__).parent.parent / "Dataset_Oriente_Puntos_final.csv"
BATCH_SIZE = 5000

INSERT_SQL = (
    "INSERT OR REPLACE INTO samples "
    "(id, departamento, municipio, lat, lon, diferencia_biomasa) "
    "VALUES (?, ?, ?, ?, ?, ?)"
)


def seed(force: bool = False) -> int:
    init_db()
    conn = get_connection()
    cur = conn.cursor()

    if not force:
        existing = cur.execute("SELECT COUNT(*) FROM samples").fetchone()[0]
        if existing > 0:
            conn.close()
            print(f"Ya hay {existing} registros en samples.db, omitiendo carga.")
            return existing

    if not CSV_PATH.exists():
        conn.close()
        raise FileNotFoundError(f"No se encontro el CSV en {CSV_PATH}")

    batch = []
    inserted = 0
    with open(CSV_PATH, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            batch.append(
                (
                    row["id"],
                    row["Departamento"],
                    row["Municipio"],
                    float(row["lat"]),
                    float(row["lon"]),
                    float(row["Diferencia_Biomasa"]),
                )
            )
            if len(batch) >= BATCH_SIZE:
                cur.executemany(INSERT_SQL, batch)
                conn.commit()
                inserted += len(batch)
                batch.clear()

        if batch:
            cur.executemany(INSERT_SQL, batch)
            conn.commit()
            inserted += len(batch)

    conn.close()
    print(f"Carga completa: {inserted} puntos insertados desde {CSV_PATH.name}")
    return inserted


if __name__ == "__main__":
    seed(force=True)
