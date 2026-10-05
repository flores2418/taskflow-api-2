const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "El email no tiene un formato valido"],
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "member"],
        message: "El rol debe ser admin o member",
      },
      default: "member",
    },
    teamId: { type: Schema.Types.ObjectId, ref: "Team" },
  },
  { timestamps: true, collection: "Users" }
);

module.exports = model("User", userSchema);
