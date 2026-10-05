const Team = require("../models/Team");
const { httpError } = require("../middlewares/errorHandler");

exports.getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find().sort("name");
    res.json(teams);
  } catch (err) {
    next(err);
  }
};

exports.getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate("members", "name email");
    if (!team) throw httpError(404, "Equipo no encontrado");
    res.json(team);
  } catch (err) {
    next(err);
  }
};

exports.createTeam = async (req, res, next) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (err) {
    next(err);
  }
};

exports.updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!team) throw httpError(404, "Equipo no encontrado");
    res.json(team);
  } catch (err) {
    next(err);
  }
};

exports.deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) throw httpError(404, "Equipo no encontrado");
    res.json({ message: "Equipo eliminado", team });
  } catch (err) {
    next(err);
  }
};
