const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      enum: ["daily", "weekly", "monthly", "long-term", "fitness", "study", "career", "personal"],
      required: true
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    deadline: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "completed", "missed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

goalSchema.index({ userId: 1, status: 1 });

goalSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model("Goal", goalSchema);
