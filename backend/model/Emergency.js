import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    hospital: { type: String, required: true, trim: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    units: { type: Number, required: true, min: 1, max: 20 },
    division: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    upazila: { type: String, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, trim: true, lowercase: true },
    details: { type: String, maxlength: 1000 },
    urgency: {
      type: String,
      enum: ["Critical", "Urgent", "Normal"],
      default: "Urgent"
    },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notifiedCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Emergency = mongoose.model("Emergency", emergencySchema);

export default Emergency;