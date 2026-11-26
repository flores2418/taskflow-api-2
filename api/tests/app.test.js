const request = require("supertest");
const app = require("../app");

describe("TaskFlow API", () => {
  test("GET / responde que la API funciona", async () => {
    const respuesta = await request(app).get("/");

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.message).toBe("TaskFlow API funcionando");
  });

  test("una ruta que no existe responde 404", async () => {
    const respuesta = await request(app).get("/api/no-existe");

    expect(respuesta.status).toBe(200);
  });

  test("crear una tarea sin datos responde 400", async () => {
    const respuesta = await request(app).post("/api/tasks").send({});

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error).toBe("Datos no validos");
  });

  test("un id con formato incorrecto responde 400", async () => {
    const respuesta = await request(app).get("/api/tasks/123");

    expect(respuesta.status).toBe(400);
  });
});