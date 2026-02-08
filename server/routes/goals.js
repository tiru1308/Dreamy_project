const express = require("express");
const Goal = require("../models/Goal");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  const { category, status } = req.query;
  const filters = { userId: req.user.id };

  if (category) {
    filters.category = category;
  }
  if (status) {
    filters.status = status;
  }

  const goals = await Goal.find(filters).sort({ createdAt: -1 });
  return res.json(goals);
});

router.get("/:id", async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
  if (!goal) {
    return res.status(404).json({ message: "Goal not found" });
  }
  return res.json(goal);
});

router.post("/", async (req, res) => {
  const { title, description, category, priority, deadline } = req.body;
  if (!title || !category || !deadline) {
    return res.status(400).json({ message: "Title, category, and deadline are required" });
  }

  const goal = await Goal.create({
    userId: req.user.id,
    title,
    description,
    category,
    priority,
    deadline
  });

  return res.status(201).json(goal);
});

router.put("/:id", async (req, res) => {
  const updates = req.body;
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    updates,
    { new: true }
  );

  if (!goal) {
    return res.status(404).json({ message: "Goal not found" });
  }

  return res.json(goal);
});

router.delete("/:id", async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!goal) {
    return res.status(404).json({ message: "Goal not found" });
  }
  return res.json({ message: "Goal deleted" });
});

module.exports = router;
