const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "El titulo es obligatorio"],
      trim: true,
      minlength: [3, "El titulo debe tener al menos 3 caracteres"],
    },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: {
        values: ["todo", "in-progress", "done"],
        message: "El estado debe ser todo, in-progress o done",
      },
      default: "todo",
    },
    priority: {
      type: Number,
      min: [1, "La prioridad minima es 1"],
      max: [5, "La prioridad maxima es 5"],
      default: 3,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "El equipo es obligatorio"],
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    completedAt: Date,
  },
  { timestamps: true, collection: "Tasks" }
);

taskSchema.pre("save", function () {
  if (this.status === "done" && !this.completedAt) {
    this.completedAt = new Date();
  }
});

module.exports = model("Task", taskSchema);
