const express = require("express");
const cors = require("cors");

const teamRoutes = require("./routes/teamRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "TaskFlow API funcionando" });
});

app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
