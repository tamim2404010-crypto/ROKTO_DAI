
import crypto from "crypto";
import User from "../model/user.schema.js";
import { sendEmail } from "../utils/sendEmail.js";

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(String(otp)).digest("hex");

export const sendOtp = async (user) => {
  const otp = String(crypto.randomInt(100000, 1000000));

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        isVerified: false,
        otp: hashOtp(otp),
        otpExpires: new Date(Date.now() + 10 * 60 * 1000)
      }
    }
  );

  await sendEmail({
    to: user.email,
    subject: "Rokto Dai - Email Verification Code",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:420px;border:2px solid #B42332;border-radius:12px;padding:20px">
        <h2 style="color:#B42332">Verify your email</h2>
        <p>Your verification code is:</p>
        <p style="font-size:32px;font-weight:bold;letter-spacing:6px">${otp}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `
  });
};


export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    const user = await User.findOne({
      email: String(email).trim().toLowerCase()
    }).select("+otp +otpExpires");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isVerified === true) {
      return res.status(200).json({
        success: true,
        message: "Email already verified"
      });
    }

    if (
      !user.otp ||
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one"
      });
    }

    if (user.otp !== hashOtp(String(otp).trim())) {
      return res.status(400).json({
        success: false,
        message: "Wrong OTP"
      });
    }

    await User.updateOne(
      { _id: user._id },
      {
        $set: { isVerified: true },
        $unset: { otp: "", otpExpires: "" }
      }
    );

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can login now."
    });

  } catch (error) {
    console.log("Verify Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Verification failed"
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({
      email: String(email).trim().toLowerCase()
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isVerified === true) {
      return res.status(400).json({
        success: false,
        message: "Email already verified"
      });
    }

    await sendOtp(user);

    return res.status(200).json({
      success: true,
      message: "New OTP sent to your email"
    });

  } catch (error) {
    console.log("Resend OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not send OTP. Check email configuration."
    });
  }
};
