import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "samples.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS samples (
            id TEXT PRIMARY KEY,
            departamento TEXT NOT NULL,
            municipio TEXT NOT NULL,
            lat REAL NOT NULL,
            lon REAL NOT NULL,
            diferencia_biomasa REAL NOT NULL
        )
        """
    )
    conn.execute("CREATE INDEX IF NOT EXISTS idx_departamento ON samples(departamento)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_municipio ON samples(municipio)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_diferencia_biomasa ON samples(diferencia_biomasa)")
    conn.commit()
    conn.close()
