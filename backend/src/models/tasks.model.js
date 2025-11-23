import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    complete_status_note: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task',taskSchema);

