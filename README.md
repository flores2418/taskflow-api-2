# TaskFlow

[![CI](https://github.com/flores2418/taskflow-api-2/actions/workflows/ci.yml/badge.svg)](https://github.com/flores2418/taskflow-api-2/actions/workflows/ci.yml)
[![CD](https://github.com/flores2418/taskflow-api-2/actions/workflows/cd.yml/badge.svg)](https://github.com/flores2418/taskflow-api-2/actions/workflows/cd.yml)

Aplicación para gestionar tareas en equipo. Tiene una API en Node.js con Express y MongoDB, y un frontend en React.

Todo corre con Docker Compose: un comando levanta la base de datos, la API y el frontend.

## Requisitos previos

- Docker Desktop instalado y abierto
- Git

No hace falta instalar Node ni MongoDB, porque todo corre dentro de contenedores.

## Cómo levantarlo desde cero

1. Clonar el repositorio:

```bash
git clone https://github.com/flores2418/taskflow-api-2.git
cd taskflow-api-2
```

2. Crear el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

3. Abrir `.env` y poner un usuario y una clave para MongoDB. Por ejemplo:

```
MONGO_USER=admin
MONGO_PASSWORD=prueba123
MONGO_DB_NAME=taskflow
VITE_API_URL=http://localhost:3000
```

4. Levantar todo:

```bash
docker compose up -d --build
```

5. Revisar que los tres servicios estén corriendo:

```bash
docker compose ps
```

`mongo` debe aparecer como `healthy`, y `api` y `web` como `Up`.

## Puertos y URLs

| Servicio | URL | Qué es |
|---|---|---|
| web | http://localhost:8080 | La página de TaskFlow |
| api | http://localhost:3000 | La API REST |
| mongo | sin puerto publicado | Solo se puede usar dentro de la red de Docker |

Para probar, abre http://localhost:8080, crea un equipo y después una tarea.

## Detener y borrar los datos

Detener los contenedores (los datos de Mongo se quedan guardados en el volumen):

```bash
docker compose down
```

Detener y borrar también los datos:

```bash
docker compose down -v
```

## Estructura

```
taskflow-api-2/
├── .github/workflows/   ci.yml y cd.yml
├── api/                 API en Node.js y Express
│   ├── Dockerfile
│   ├── .dockerignore
│   └── tests/
├── web/                 Frontend en React, servido con Nginx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── docker-compose.yml
├── .env.example
└── .gitignore
```

## Variables de entorno

| Variable | Para qué sirve |
|---|---|
| `MONGO_USER` | Usuario administrador de MongoDB |
| `MONGO_PASSWORD` | Clave de ese usuario |
| `MONGO_DB_NAME` | Nombre de la base de datos |
| `VITE_API_URL` | Dirección de la API que usa el frontend. Se fija al compilar |

El `.env` está en `.gitignore` y nunca se sube al repositorio.

## Endpoints de la API

| Recurso | Rutas |
|---|---|
| Equipos | `GET, POST /api/teams` · `GET, PUT, DELETE /api/teams/:id` |
| Usuarios | `GET, POST /api/users` · `GET, PUT, DELETE /api/users/:id` |
| Tareas | `GET, POST /api/tasks` · `GET, PUT, DELETE /api/tasks/:id` |

`GET /api/tasks` acepta filtros, orden y paginación. Ejemplo: `?status=todo&sort=-priority&page=1&limit=10`

## Pipeline CI/CD

Uso GitHub Actions con dos workflows, `ci.yml` y `cd.yml`, en `.github/workflows/`.

**En cada pull request** corre `ci.yml` con tres jobs:

- `api`: instala, corre el lint y las pruebas de la API.
- `web`: instala, corre el lint, las pruebas y el build del frontend.
- `docker`: cuando los otros dos pasan, construye las imágenes con `docker compose build`.

`main` está protegida, así que no se puede subir directo. Todo entra por pull request y solo se puede hacer merge si los tres checks están en verde.

**Al hacer merge a main** corre `cd.yml`, que publica las imágenes en GitHub Container Registry:

- `ghcr.io/flores2418/taskflow-api`
- `ghcr.io/flores2418/taskflow-web`

Cada merge crea los tags `sha-<commit>` y `latest`. Cuando creo un tag de Git como `v1.0.0`, también se publican `1.0.0` y `1.0`. Las imágenes están en la pestaña **Packages** del repo.

**Secrets y variables:** el login a GHCR usa `secrets.GITHUB_TOKEN`, que GitHub genera solo, así que no hay ningún token en el código. La dirección de la API para el frontend está en la variable del repo `VITE_API_URL`.