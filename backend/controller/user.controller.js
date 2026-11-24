
import User from "../model/user.schema.js";
import jwt from "jsonwebtoken";
import { sendOtp } from "./verify.controller.js";


const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};



export const signup = async (req, res) => {
  try {
    const {
      fullName,
      name,
      email,
      phone,
      password,
      confirmPassword,
      dob,
      gender,
      bloodGroup,
      division,
      district,
      upazila,
      address,
      lastDonation,
      available
    } = req.body;

    if (
      !(fullName || name) ||
      !email ||
      !phone ||
      !password ||
      !bloodGroup ||
      !division ||
      !district ||
      !upazila ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password does not match"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingEmail = await User.findOne({
      email: normalizedEmail
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered"
      });
    }

    const newUser = await User.create({
      name: fullName || name,
      email: normalizedEmail,
      phone,
      password,
      dob: dob || undefined,
      gender: gender || undefined,
      bloodGroup,
      division,
      district,
      upazila,
      address,
      lastDonationDate: lastDonation || undefined,
      isDonor: true,
      isAvailable: available ?? true,
      isVerified: false
    });


    try {
      await sendOtp(newUser);

      return res.status(201).json({
        success: true,
        message: "Registration successful. Check your email for the verification code.",
        email: newUser.email,
        otpSent: true
      });

    } catch (mailError) {
      console.log("OTP Email Error:", mailError.message);

      return res.status(201).json({
        success: true,
        message: "Account created, but OTP email could not be sent. Please resend the OTP.",
        email: newUser.email,
        otpSent: false
      });
    }

  } catch (error) {
    console.log("Signup Error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }


    if (user.isVerified !== true) {
      return res.status(403).json({
        success: false,
        needVerify: true,
        email: user.email,
        message: "Please verify your email before login"
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        division: user.division,
        district: user.district,
        upazila: user.upazila
      }
    });

  } catch (error) {
    console.log("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
};
