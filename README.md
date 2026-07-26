# SOC-BO

**No predecimos incendios. Medimos criticalidad.**

SOC-BO es un instrumento público de medición de criticalidad autoorganizada (SOC) en Bolivia. Expone un dataset de **57.576 puntos** en Santa Cruz, Beni y Pando, un dashboard interactivo y una API REST de solo lectura para investigadores, aplicaciones de terceros o agentes de IA.

---

## ¿Qué mide?

La vegetación acumula biomasa de forma continua. Cada punto del territorio tiene un umbral crítico a partir del cual el sistema deja de absorber y empieza a liberar. Cuando se cruza ese umbral, basta una perturbación mínima para desencadenar un colapso local.

SOC-BO mide **dónde está cada punto respecto a su umbral** (`diferencia_biomasa`), no cuándo ocurrirá el colapso.

| Métrica | Valor |
|---|---|
| Puntos medidos | 57.576 |
| Departamentos | Santa Cruz, Beni, Pando |
| Resolución de grilla | ~3,3 km (0,03° de latitud) |
| Campo principal | `diferencia_biomasa` |

---

## Estructura del monorepo

```
CRITICALIDAD-EN-DATOS/
├── Dataset_Oriente_Puntos_final.csv   # fuente del dataset
├── render.yaml                        # blueprint del API en Render
├── backend/                           # FastAPI + SQLite
│   ├── main.py                        # endpoints REST
│   ├── database.py                    # conexión e índices
│   ├── seed.py                        # carga el CSV → samples.db
│   └── requirements.txt
└── frontend/                          # Next.js (App Router)
    └── src/
        ├── app/
        │   ├── page.tsx               # landing (/)
        │   ├── dashboard/page.tsx     # mapa + stats
        │   └── api/page.tsx           # docs de la API
        ├── components/                # HeatMap, StatsPanel, etc.
        └── lib/                       # cliente HTTP, tipos, colores
```

---

## Stack

| Capa | Tecnología |
|---|---|
| API | FastAPI + Uvicorn |
| Datos | SQLite (sembrada desde CSV al arrancar) |
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Mapa | Leaflet + react-leaflet (canvas) |
| Deploy API | Render (Web Service, plan Starter) |
| Deploy web | Vercel (Root Directory = `frontend`) |

---

## Arranque local

### Requisitos

- Python 3.12+
- Node.js 20+
- El CSV en la raíz del repo (`Dataset_Oriente_Puntos_final.csv`)

### 1. Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Al arrancar:

1. Crea `samples.db` si no existe.
2. Si la tabla está vacía, carga los 57.576 puntos desde el CSV.
3. Expone la API en `http://localhost:8000`.
4. Docs interactivas en `http://localhost:8000/docs` (Swagger).

Para forzar una recarga completa del CSV:

```bash
python seed.py
```

### 2. Frontend

```bash
cd frontend
npm install
```

Creá `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm run dev
```

Abrí `http://localhost:3000`.

| Ruta | Qué muestra |
|---|---|
| `/` | Landing: propuesta, stats y CTAs |
| `/dashboard` | Heatmap + panel de estadísticas + filtros |
| `/api` | Documentación humana de los endpoints |

---

## API REST

Diseñada para ser consumida por investigadores, aplicaciones de terceros o agentes de IA. Solo lectura (`GET`). Sin autenticación.

**URL base local:** `http://localhost:8000`  
**URL base producción:** la URL del servicio en Render (ej. `https://soc-bo-api.onrender.com`)

### Modelo de un punto

```json
{
  "id": "BEN-00001",
  "departamento": "Beni",
  "municipio": "Trinidad",
  "lat": -14.83,
  "lon": -64.9,
  "diferencia_biomasa": -0.18
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | Identificador único del punto |
| `departamento` | string | `Santa Cruz`, `Beni` o `Pando` |
| `municipio` | string | Municipio al que pertenece |
| `lat` / `lon` | number | Coordenadas WGS84 |
| `diferencia_biomasa` | number | Desvío respecto al umbral crítico (negativo = déficit, positivo = acumulación) |

---

### `GET /`

Health check.

```bash
curl http://localhost:8000/
```

```json
{ "status": "ok", "service": "criticalidad-en-datos-api" }
```

---

### `GET /samples`

Lista paginada de puntos, con filtros y ordenamiento.

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `page` | int ≥ 1 | `1` | Página |
| `page_size` | int 1–5000 | `100` | Tamaño de página |
| `departamento` | string | — | Filtra por departamento |
| `municipio` | string | — | Filtra por municipio |
| `min_diferencia` | float | — | `diferencia_biomasa >= valor` |
| `max_diferencia` | float | — | `diferencia_biomasa <= valor` |
| `sort_by` | enum | `id` | `id` \| `diferencia_biomasa` \| `lat` \| `lon` |
| `order` | enum | `asc` | `asc` \| `desc` |

```bash
curl "http://localhost:8000/samples?page=1&page_size=2&departamento=Beni"
```

```json
{
  "total": 18432,
  "page": 1,
  "page_size": 2,
  "total_pages": 9216,
  "items": [
    {
      "id": "BEN-00001",
      "departamento": "Beni",
      "municipio": "Trinidad",
      "lat": -14.83,
      "lon": -64.9,
      "diferencia_biomasa": -0.18
    }
  ]
}
```

El dashboard descarga el mapa paginando este endpoint (`page_size=5000`) en paralelo, no vía `/download`.

---

### `GET /samples/{id}`

Un punto individual.

```bash
curl http://localhost:8000/samples/BEN-00001
```

Respuesta `404` si el id no existe.

---

### `GET /stats`

Agregados globales (o filtrados por departamento).

| Parámetro | Tipo | Descripción |
|---|---|---|
| `departamento` | string | Opcional. Filtra totales, promedio, min/max, municipios y top de riesgo. El desglose `por_departamento` siempre es global para comparar. |

```bash
curl "http://localhost:8000/stats?departamento=Santa%20Cruz"
```

```json
{
  "total_puntos": 57576,
  "promedio_global": 0.17,
  "max_diferencia_biomasa": 0.61,
  "min_diferencia_biomasa": -0.31,
  "por_departamento": [
    { "departamento": "Beni", "promedio": 0.217, "count": 18432 }
  ],
  "por_municipio": [
    {
      "municipio": "Trinidad",
      "departamento": "Beni",
      "promedio": 0.31,
      "count": 1204
    }
  ],
  "top_riesgo": [ /* 50 puntos con mayor diferencia_biomasa */ ]
}
```

---

### `GET /download`

Descarga completa del dataset (CSV o JSON), opcionalmente filtrada.

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `format` | enum | `csv` | `csv` \| `json` |
| `departamento` | string | — | Filtra por departamento |

```bash
# CSV completo
curl -OJ "http://localhost:8000/download?format=csv"

# JSON de un departamento
curl -OJ "http://localhost:8000/download?format=json&departamento=Pando"
```

---

### Ejemplos de uso

**Python**

```python
import requests

BASE = "http://localhost:8000"

stats = requests.get(f"{BASE}/stats").json()
print(stats["total_puntos"], stats["promedio_global"])

page = requests.get(
    f"{BASE}/samples",
    params={"departamento": "Beni", "page_size": 100, "sort_by": "diferencia_biomasa", "order": "desc"},
).json()
for p in page["items"]:
    print(p["municipio"], p["diferencia_biomasa"])
```

**JavaScript (fetch)**

```js
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const res = await fetch(`${API}/stats?departamento=Pando`);
const stats = await res.json();
console.log(stats.total_puntos, stats.promedio_global);
```

**curl + jq**

```bash
curl -s "http://localhost:8000/stats" | jq '.por_departamento'
```

---

## Frontend: qué hace cada pieza

| Pieza | Rol |
|---|---|
| Landing `/` | Presenta SOC-BO, stats del dataset, explicación del modelo y CTAs |
| Dashboard `/dashboard` | Explora el mapa de calor y las estadísticas filtrables |
| Docs `/api` | Documentación humana de los 4 endpoints |
| `HeatMap` | Leaflet con tiles claro/oscuro; radio según zoom; agregación en celdas de 10 km cuando zoom ≤ 8 |
| `StatsPanel` | Totales, promedio, min/max, ranking por municipio y top de riesgo |
| `DepartmentFilter` | Filtra mapa y stats por departamento |
| `DownloadButton` | Descarga CSV/JSON vía `/download` |
| `Legend` | Escala de color divergente (marrón → verde) para `diferencia_biomasa` |

Variables de entorno del frontend:

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base de la API. Se hornea en el bundle en tiempo de build. |

---

## Despliegue

### Orden recomendado

Hay una dependencia circular entre orígenes:

1. **Render (API) primero** — dejá `ALLOWED_ORIGINS=*` o vacío (cae a `*`).
2. Verificá `GET /` y `GET /stats`.
3. **Vercel (frontend)** — Root Directory = `frontend`, y seteá `NEXT_PUBLIC_API_URL` **antes** del primer deploy.
4. Volvé a Render y restringí `ALLOWED_ORIGINS` al dominio de Vercel.

### API en Render

El archivo `render.yaml` ya define el servicio:

- Nombre: `soc-bo-api`
- Runtime: Python 3.12
- Root: `backend`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Plan: Starter (sin cold start)
- Env: `ALLOWED_ORIGINS` (orígenes del frontend, separados por coma)

En el primer arranque, `seed()` reconstruye `samples.db` desde el CSV versionado. No hace falta disco persistente.

### Frontend en Vercel

1. Importá el mismo repo.
2. **Root Directory** = `frontend`.
3. Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://<tu-servicio>.onrender.com
   ```
4. Deploy.

Si cambiás `NEXT_PUBLIC_API_URL` después del primer deploy, hay que **redesplegar**: las variables `NEXT_PUBLIC_*` no se actualizan en caliente.

### CORS

La API solo acepta `GET`, sin cookies. Orígenes permitidos salen de `ALLOWED_ORIGINS`. Si la variable está vacía o no existe, se usa `*`.

```bash
# Ejemplo en Render, una vez tengas el dominio de Vercel
ALLOWED_ORIGINS=https://soc-bo.vercel.app,http://localhost:3000
```

---

## Notas de diseño del mapa

- La grilla real del dataset es **0,03° ≈ 3,34 km**, no 1 km.
- A zoom bajo (≤ 8) los puntos se agregan en celdas de **10 km** (promedio de `diferencia_biomasa`) para evitar la mancha continua por solapamiento.
- A zoom alto se dibujan puntos individuales con radio en píxeles derivado del tamaño real de celda (mín. 2 px, máx. 10 px).
- La paleta es divergente: marrón/ocre (déficit) → verde (acumulación).

---

## Licencia y uso de los datos

Dataset público orientado a investigación y reutilización. La API no requiere clave. Si publicás trabajo derivado, citá el proyecto SOC-BO y la cobertura geográfica (oriente boliviano: Santa Cruz, Beni y Pando).
