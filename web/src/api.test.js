import { afterEach, describe, expect, test, vi } from 'vitest';
import { pedir } from './api.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('pedir', () => {
  test('devuelve los datos cuando la API responde bien', async () => {
    const respuestaFalsa = {
      ok: true,
      json: async () => ({ data: [] }),
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respuestaFalsa));

    const datos = await pedir('/api/tasks');

    expect(datos).toEqual({ data: [] });
  });

  test('lanza el mensaje de error cuando la API responde con error', async () => {
    const respuestaFalsa = {
      ok: false,
      json: async () => ({ error: 'Datos no validos', details: ['El titulo es obligatorio'] }),
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respuestaFalsa));

    const peticion = pedir('/api/tasks', { method: 'POST' });

    await expect(peticion).rejects.toThrow('El titulo es obligatorio');
  });
});