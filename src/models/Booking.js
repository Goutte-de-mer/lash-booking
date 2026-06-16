import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  slotStart: { type: Date, required: true },
  duration: { type: Number, required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  paymentType: { type: String, enum: ["deposit", "full"] },
  paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  amountPaid: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;
