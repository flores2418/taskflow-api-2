const Task = require("../models/Task");
const { httpError } = require("../middlewares/errorHandler");

exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, teamId, assignedTo, sort } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (teamId) filter.teamId = teamId;
    if (assignedTo) filter.assignedTo = assignedTo;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("teamId", "name")
      .sort(sort || "-createdAt")
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(filter);

    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("teamId", "name");
    if (!task) throw httpError(404, "Tarea no encontrada");
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// Se usa save() en vez de findByIdAndUpdate para que corra el pre("save")
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) throw httpError(404, "Tarea no encontrada");

    task.set(req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) throw httpError(404, "Tarea no encontrada");
    res.json({ message: "Tarea eliminada", task });
  } catch (err) {
    next(err);
  }
};
