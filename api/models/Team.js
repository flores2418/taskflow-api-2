const { Schema, model } = require("mongoose");

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del equipo es obligatorio"],
      unique: true,
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [50, "El nombre no puede pasar de 50 caracteres"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "La descripcion no puede pasar de 200 caracteres"],
    },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, collection: "Teams" }
);

module.exports = model("Team", teamSchema);
