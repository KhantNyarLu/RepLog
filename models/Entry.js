const mongoose = require("mongoose");

// I define a schema that represents a single workout entry in MongoDB.
// Each property corresponds to one of the fields on my forms.
const entrySchema = new mongoose.Schema({
  // When the workout happened. Stored as a Date and required.
  date: { type: Date, required: true },

  // Name of the exercise, e.g., "Bench Press".
  exercise: { type: String, required: true },

  // High-level muscle group (Chest, Back, etc.).
  muscleGroup: { type: String, required: true },

  // Number of sets performed.
  sets: { type: Number, required: true },

  // Reps pattern like "12-12-10". I store it as a String so I can keep
  // different patterns (e.g., 8-8-6, 5/3/1) without enforcing a numeric format.
  reps: { type: String, required: true },

  // Weight is optional as some exercises might be bodyweight only.
  weight: { type: Number },

  // RPE is a 1–10 scale. I add min/max validation to avoid impossible values.
  rpe: { type: Number, min: 1, max: 10 },

  // Free-form user notes.
  notes: { type: String },

  // I also keep a createdAt timestamp for sorting when date is missing or equal.
  createdAt: { type: Date, default: Date.now },
});

// Finally I compile the schema into a model so I can use Entry.find(), etc.
module.exports = mongoose.model("Entry", entrySchema);
