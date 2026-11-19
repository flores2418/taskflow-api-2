const User = require("../models/User");
const Team = require("../models/Team");
const { httpError } = require("../middlewares/errorHandler");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("teamId", "name").sort("name");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("teamId", "name");
    if (!user) throw httpError(404, "Usuario no encontrado");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    if (req.body.teamId) {
      const team = await Team.findById(req.body.teamId);
      if (!team) throw httpError(404, "Equipo no encontrado");
    }

    const user = await User.create(req.body);

    if (user.teamId) {
      await Team.findByIdAndUpdate(user.teamId, { $addToSet: { members: user._id } });
    }

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!user) throw httpError(404, "Usuario no encontrado");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw httpError(404, "Usuario no encontrado");

    if (user.teamId) {
      await Team.findByIdAndUpdate(user.teamId, { $pull: { members: user._id } });
    }

    res.json({ message: "Usuario eliminado", user });
  } catch (err) {
    next(err);
  }
};
