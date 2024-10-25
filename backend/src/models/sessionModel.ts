import { Schema, model } from "mongoose";
import { ISession } from "../interface/trainer_interface";

const sessionSchema = new Schema<ISession>({
  trainerId: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  time: { type: String, required: true },
  isSingleSession: { type: Boolean, required: true },
  // numberOfSessions: { type: Number, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed", "Cancelled", "InProgress"],
    default: "Pending",
    required: true,
  },
});

const Session = model<ISession>("Session", sessionSchema);

export default Session;
