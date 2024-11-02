import mongoose, { Schema, model } from "mongoose";
import { IBooking } from '../interface/common';

const bookingSchema = new Schema<IBooking>({
  sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
  trainerId: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
  sessionType: { type: String, required: true },
  bookingDate: { type: Date, default: Date.now }, 
  startDate: { type: Date, required: true }, 
  endDate: { type: Date, required: false }, 
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: [ "Confirmed", "Cancelled"], default: "Confirmed" }, 
}, {
  timestamps: true, 
});

const BookingModel = model<IBooking>('Booking', bookingSchema);

export default BookingModel;