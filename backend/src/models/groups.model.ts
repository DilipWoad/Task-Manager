import mongoose, { Schema, Document, Types, Model } from "mongoose";

interface IGroup {
  groupName: string;
  groupAdmin: Types.ObjectId;
  groupMembers: Types.ObjectId[];
}

interface IGroupDocument extends IGroup, Document {
  createdAt: Date;
  updatedAt: Date;
}

type GroupModel = Model<IGroupDocument>;

const groupSchema = new Schema<IGroupDocument, GroupModel>({
  groupName: {
    type: String,
    required: true,
    trim: true,
  },
  groupAdmin: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  groupMembers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const Group: GroupModel = mongoose.model<IGroupDocument, GroupModel>(
  "Group",
  groupSchema,
);
