import { useEffect, useState } from 'react';
import { pedir } from './api.js';

const ESTADOS = {
  todo: 'Pendiente',
  'in-progress': 'En progreso',
  done: 'Terminada',
};

export default function App() {
  const [equipos, setEquipos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [titulo, setTitulo] = useState('');
  const [equipoId, setEquipoId] = useState('');
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    try {
      const listaEquipos = await pedir('/api/teams');
      const respuestaTareas = await pedir('/api/tasks?limit=100');
      setEquipos(listaEquipos);
      setTareas(respuestaTareas.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const crearEquipo = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const nuevoEquipo = { name: nombreEquipo };
      await pedir('/api/teams', { method: 'POST', body: JSON.stringify(nuevoEquipo) });
      setNombreEquipo('');
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const crearTarea = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const nuevaTarea = { title: titulo, teamId: equipoId };
      await pedir('/api/tasks', { method: 'POST', body: JSON.stringify(nuevaTarea) });
      setTitulo('');
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const completarTarea = async (id) => {
    setError('');

    try {
      const cambios = { status: 'done' };
      await pedir('/api/tasks/' + id, { method: 'PUT', body: JSON.stringify(cambios) });
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminarTarea = async (id) => {
    setError('');

    try {
      await pedir('/api/tasks/' + id, { method: 'DELETE' });
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const hayEquipos = equipos.length > 0;
  const hayTareas = tareas.length > 0;

  return (
    <main>
      <h1>TaskFlow</h1>

      {error && <p className="error">{error}</p>}

      <section>
        <h2>Nuevo equipo</h2>
        <form onSubmit={crearEquipo}>
          <input
            placeholder="Nombre del equipo"
            value={nombreEquipo}
            onChange={(e) => setNombreEquipo(e.target.value)}
          />
          <button type="submit">Crear equipo</button>
        </form>
      </section>

      <section>
        <h2>Nueva tarea</h2>
        <form onSubmit={crearTarea}>
          <input
            placeholder="Título de la tarea"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <select value={equipoId} onChange={(e) => setEquipoId(e.target.value)}>
            <option value="">Elige un equipo</option>
            {equipos.map((equipo) => (
              <option key={equipo._id} value={equipo._id}>
                {equipo.name}
              </option>
            ))}
          </select>
          <button type="submit" disabled={!hayEquipos}>
            Crear tarea
          </button>
        </form>
      </section>

      <section>
        <h2>Tareas</h2>
        {!hayTareas && <p>Todavía no hay tareas.</p>}
        <ul>
          {tareas.map((tarea) => {
            const nombreDelEquipo = tarea.teamId ? tarea.teamId.name : 'Sin equipo';
            const estado = ESTADOS[tarea.status];
            const estaTerminada = tarea.status === 'done';

            return (
              <li key={tarea._id}>
                <span>
                  <strong>{tarea.title}</strong> · {nombreDelEquipo} · {estado}
                </span>
                <span>
                  {!estaTerminada && (
                    <button onClick={() => completarTarea(tarea._id)}>Completar</button>
                  )}
                  <button onClick={() => eliminarTarea(tarea._id)}>Eliminar</button>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}