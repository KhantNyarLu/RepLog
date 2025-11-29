// -------------------- ENV + IMPORTS --------------------
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const Entry = require("./models/Entry");

const app = express();

// -------------------- DATABASE --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// -------------------- EJS + MIDDLEWARE --------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts); // Enable layouts
app.set("layout", "layout"); // layout.ejs inside /views

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // PUT / DELETE support
app.use(express.static(path.join(__dirname, "public"))); // CSS, JS, images

// -------------------- ROUTES --------------------

// HOME (list all entries)
app.get("/", async (req, res) => {
  try {
    const entries = await Entry.find().sort({ date: -1, createdAt: -1 });
    res.render("index", { entries });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// NEW FORM
app.get("/entries/new", (req, res) => {
  res.render("new");
});

// CREATE ENTRY
app.post("/entries", async (req, res) => {
  try {
    const { date, exercise, muscleGroup, sets, reps, weight, rpe, notes } =
      req.body;

    await Entry.create({
      date,
      exercise,
      muscleGroup,
      sets,
      reps,
      weight: weight || undefined,
      rpe: rpe || undefined,
      notes,
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating entry");
  }
});

// EDIT FORM
app.get("/entries/:id/edit", async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).send("Entry not found");
    res.render("edit", { entry });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading entry");
  }
});

// UPDATE ENTRY
app.put("/entries/:id", async (req, res) => {
  try {
    const { date, exercise, muscleGroup, sets, reps, weight, rpe, notes } =
      req.body;

    await Entry.findByIdAndUpdate(req.params.id, {
      date,
      exercise,
      muscleGroup,
      sets,
      reps,
      weight: weight || undefined,
      rpe: rpe || undefined,
      notes,
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating entry");
  }
});

// DELETE ENTRY
app.delete("/entries/:id", async (req, res) => {
  try {
    await Entry.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting entry");
  }
});

// API ENDPOINT
app.get("/api/entries", async (req, res) => {
  try {
    const entries = await Entry.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------- EXPORT + LOCAL SERVER --------------------

// Export the Express app for Vercel
module.exports = app;

// Only start listening when NOT on Vercel (i.e., local dev)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 RepLog running at http://localhost:${PORT}`);
  });
}
