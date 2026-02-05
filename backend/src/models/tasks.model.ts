import mongoose, { Document, Model, Types, Schema } from "mongoose";

interface ITask {
  status: string;
  title: string;
  description: string;
  deadline: Date;
  assigned_to: Types.ObjectId;
  complete_status_note: string;
}

interface ITaskDocument extends ITask, Document {
  createdAt: string;
  updatedAt: string;
}
type TaskModel = Model<ITaskDocument>;
const taskSchema = new Schema<ITaskDocument, TaskModel>(
  {
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
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
      trim: true,
    },
  },
  { timestamps: true },
);

export const Task: TaskModel = mongoose.model<ITaskDocument, TaskModel>(
  "Task",
  taskSchema,
);
