import mongoose from "mongoose";

const workingHoursSchema = new mongoose.Schema({
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
  startTime: String,
  endTime: String,
  isActive: { type: Boolean, default: true },
});

const WorkingHours =
  mongoose.models.WorkingHours || mongoose.model("WorkingHours", workingHoursSchema);
export default WorkingHours;
