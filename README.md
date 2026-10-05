# TaskFlow API

API REST para gestionar tareas en equipo: usuarios, equipos y tareas.
Hecha con Node.js, Express y MongoDB (Mongoose 9), conectada a MongoDB Atlas.

Proyecto final de Bases de Datos NoSQL y MongoDB, Academia Talendig.

## Instalacion y ejecucion

Requisitos: Node.js 18 o superior y un cluster en MongoDB Atlas.

```bash
git clone <URL_DEL_REPOSITORIO>
cd taskflow-api
npm install
cp .env.example .env
```

Edita `.env` con tu cadena de conexion y luego:

```bash
npm run dev
```

La API queda en `http://localhost:3000`.

## Variables de entorno

| Variable | Descripcion | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `MONGO_URI` | Cadena de conexion de Atlas | `mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/` |
| `MONGO_DB_NAME` | Nombre de la base de datos | `taskflow_api` |

El archivo `.env` esta en `.gitignore`. El repositorio solo incluye `.env.example`.

## Estructura

```
config/db.js        Conexion a MongoDB (una vez, con dbName y maxPoolSize)
models/             Team, User y Task
controllers/        Logica de cada endpoint
routes/             Endpoints de cada recurso
middlewares/        Manejo centralizado de errores
app.js              Configuracion de Express
server.js           Conecta a la base y levanta el servidor
postman/            Coleccion de Postman
requests.http       Las mismas pruebas para REST Client
```

Recorrido de una peticion: ruta → controlador → modelo → MongoDB.

## Endpoints

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/teams` | Listar equipos |
| GET | `/api/teams/:id` | Obtener un equipo con sus miembros |
| POST | `/api/teams` | Crear equipo |
| PUT | `/api/teams/:id` | Actualizar equipo |
| DELETE | `/api/teams/:id` | Eliminar equipo |
| GET | `/api/users` | Listar usuarios |
| GET | `/api/users/:id` | Obtener un usuario |
| POST | `/api/users` | Crear usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |
| GET | `/api/tasks` | Listar tareas con filtros, orden y paginacion |
| GET | `/api/tasks/:id` | Obtener una tarea |
| POST | `/api/tasks` | Crear tarea |
| PUT | `/api/tasks/:id` | Actualizar tarea |
| DELETE | `/api/tasks/:id` | Eliminar tarea |

## Consulta avanzada

`GET /api/tasks` acepta estos parametros:

| Parametro | Descripcion |
|---|---|
| `status` | `todo`, `in-progress` o `done` |
| `priority` | Prioridad de 1 a 5 |
| `teamId` | Id del equipo |
| `assignedTo` | Id del usuario |
| `sort` | Campo de orden. Con `-` adelante es descendente |
| `page` | Pagina (por defecto 1) |
| `limit` | Resultados por pagina (por defecto 10, maximo 100) |

Ejemplo: `GET /api/tasks?status=todo&sort=-priority&page=1&limit=10`

## Modelos

- **Team**: `name` (obligatorio, unico), `description`, `members` (referencias a User).
- **User**: `name`, `email` (unico, con formato validado), `role` (`admin` o `member`), `teamId` (referencia a Team).
- **Task**: `title`, `description`, `status` (`todo`, `in-progress`, `done`), `priority` (1 a 5), `teamId` (referencia a Team), `assignedTo` (referencia a User), `completedAt`.

Cuando una tarea pasa a `done`, un middleware `pre("save")` llena `completedAt`.

## Errores

Todos los errores salen con el mismo formato:

```json
{ "error": "Datos no validos", "details": ["El titulo es obligatorio"] }
```

| Codigo | Cuando |
|---|---|
| 400 | Datos no validos o id con formato incorrecto |
| 404 | El recurso o la ruta no existe |
| 409 | Registro duplicado, por ejemplo un email repetido |
| 500 | Error inesperado |

## Pruebas

- Postman: importar `postman/TaskFlow-API.postman_collection.json` y ejecutar en orden. Los ids se guardan en variables de la coleccion.
- VS Code: abrir `requests.http` con la extension REST Client.
