
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false
    },

    dob: {
      type: Date,
      default: null
    },

    gender: {
      type: String,
      default: null
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      default: null
    },

    division: {
      type: String,
      trim: true,
      default: null
    },

    district: {
      type: String,
      trim: true,
      default: null
    },

    upazila: {
      type: String,
      trim: true,
      default: null
    },

    address: {
      type: String,
      trim: true,
      default: null
    },

    // Email verification
    isVerified: {
      type: Boolean,
      default: false
    },

    otp: {
      type: String,
      select: false
    },

    otpExpires: {
      type: Date,
      select: false
    },

    // Donor information
    isDonor: {
      type: Boolean,
      default: true
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    lastDonationDate: {
      type: Date,
      default: null
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});


userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
