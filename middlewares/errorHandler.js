const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const notFound = (req, res, next) => {
  next(httpError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;
  let details = [];

  if (err.name === "ValidationError") {
    status = 400;
    message = "Datos no validos";
    details = Object.values(err.errors).map((e) =>
      e.name === "CastError" ? `El valor de ${e.path} no es valido` : e.message
    );
  } else if (err.name === "CastError") {
    status = 400;
    message = `El valor "${err.value}" no es valido para ${err.path}`;
  } else if (err.code === 11000) {
    status = 409;
    message = `Ya existe un registro con ese ${Object.keys(err.keyValue)[0]}`;
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "El body no es un JSON valido";
  }

  if (status === 500) {
    console.error(err);
    message = "Error interno del servidor";
  }

  res.status(status).json({ error: message, details });
};

module.exports = { httpError, notFound, errorHandler };
