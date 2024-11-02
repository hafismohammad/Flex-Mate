import { Schema, model } from "mongoose";
import { ISession } from "../interface/trainer_interface";

const sessionSchema = new Schema<ISession>({
  trainerId: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  selectedDate: {type: Date},
  startTime: { type: String, required: true },
  endTime: {type: String, require: true},
  isSingleSession: { type: Boolean, required: true },
  price: { type: Number, required: true },
  isBooked: {type: Boolean,  default: false},
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed", "Cancelled", "InProgress"],
    default: "Pending",
    required: true,
  },
});

const SessionModel = model<ISession>("Session", sessionSchema);

export default SessionModel;
