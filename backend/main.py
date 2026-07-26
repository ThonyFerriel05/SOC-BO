import csv
import io
import json
import os
from typing import Literal, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from database import get_connection, init_db
from seed import seed

app = FastAPI(title="Criticalidad en Datos API", version="1.0.0")

# Una variable definida pero vacia no activa el default de getenv, y dejaria la
# lista sin origenes, que en CORS significa bloquear todo.
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "*").split(",")
    if origin.strip()
] or ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    # La API es publica, de solo lectura y sin cookies. Habilitar credenciales
    # invalidaria el origen "*" en el navegador.
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

FIELDS = ["id", "departamento", "municipio", "lat", "lon", "diferencia_biomasa"]


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    seed()


def row_to_dict(row) -> dict:
    return {
        "id": row["id"],
        "departamento": row["departamento"],
        "municipio": row["municipio"],
        "lat": row["lat"],
        "lon": row["lon"],
        "diferencia_biomasa": row["diferencia_biomasa"],
    }


def build_where(
    departamento: Optional[str],
    municipio: Optional[str],
    min_diferencia: Optional[float],
    max_diferencia: Optional[float],
):
    clauses = []
    params: list = []
    if departamento:
        clauses.append("departamento = ?")
        params.append(departamento)
    if municipio:
        clauses.append("municipio = ?")
        params.append(municipio)
    if min_diferencia is not None:
        clauses.append("diferencia_biomasa >= ?")
        params.append(min_diferencia)
    if max_diferencia is not None:
        clauses.append("diferencia_biomasa <= ?")
        params.append(max_diferencia)
    where_sql = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    return where_sql, params


@app.get("/")
def root():
    return {"status": "ok", "service": "criticalidad-en-datos-api"}


@app.get("/samples")
def get_samples(
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=5000),
    departamento: Optional[str] = None,
    municipio: Optional[str] = None,
    min_diferencia: Optional[float] = None,
    max_diferencia: Optional[float] = None,
    sort_by: Literal["id", "diferencia_biomasa", "lat", "lon"] = "id",
    order: Literal["asc", "desc"] = "asc",
):
    conn = get_connection()
    where_sql, params = build_where(departamento, municipio, min_diferencia, max_diferencia)

    total = conn.execute(f"SELECT COUNT(*) FROM samples {where_sql}", params).fetchone()[0]

    offset = (page - 1) * page_size
    order_sql = "ASC" if order == "asc" else "DESC"
    rows = conn.execute(
        f"SELECT * FROM samples {where_sql} ORDER BY {sort_by} {order_sql} LIMIT ? OFFSET ?",
        [*params, page_size, offset],
    ).fetchall()
    conn.close()

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size if page_size else 0,
        "items": [row_to_dict(r) for r in rows],
    }


@app.get("/samples/{sample_id}")
def get_sample(sample_id: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM samples WHERE id = ?", (sample_id,)).fetchone()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="Punto no encontrado")
    return row_to_dict(row)


@app.get("/stats")
def get_stats(departamento: Optional[str] = None):
    conn = get_connection()
    where_sql, params = build_where(departamento, None, None, None)

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

    # Se mantiene sin filtrar para que el desglose siga sirviendo de comparacion.
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

    conn.close()

    # Un filtro sin coincidencias deja los agregados en NULL y rompe el cliente.
    return {
        "total_puntos": total_puntos,
        "promedio_global": promedio_global if promedio_global is not None else 0.0,
        "max_diferencia_biomasa": max_val if max_val is not None else 0.0,
        "min_diferencia_biomasa": min_val if min_val is not None else 0.0,
        "por_departamento": [dict(r) for r in por_departamento],
        "por_municipio": [dict(r) for r in por_municipio],
        "top_riesgo": [row_to_dict(r) for r in top_riesgo],
    }


@app.get("/download")
def download(
    format: Literal["csv", "json"] = "csv",
    departamento: Optional[str] = None,
):
    conn = get_connection()
    where_sql, params = build_where(departamento, None, None, None)
    rows = conn.execute(f"SELECT * FROM samples {where_sql}", params).fetchall()
    conn.close()

    data = [row_to_dict(r) for r in rows]

    if format == "json":
        content = json.dumps(data, ensure_ascii=False)
        return StreamingResponse(
            io.BytesIO(content.encode("utf-8")),
            media_type="application/json",
            headers={"Content-Disposition": "attachment; filename=samples.json"},
        )

    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=FIELDS)
    writer.writeheader()
    writer.writerows(data)
    return StreamingResponse(
        io.BytesIO(buffer.getvalue().encode("utf-8")),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=samples.csv"},
    )
