const API_URL = import.meta.env.VITE_API_URL;

export const pedir = async (ruta, opciones = {}) => {
  const encabezados = { 'Content-Type': 'application/json' };
  const respuesta = await fetch(API_URL + ruta, { ...opciones, headers: encabezados });
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    const mensaje = datos.details?.length ? datos.details.join('. ') : datos.error;
    throw new Error(mensaje);
  }

  return datos;
};