import express from 'express'
import {login,signup } from '../controller/user.controller.js'
import { verifyEmail, resendOtp } from "../controller/verify.controller.js";

const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)

router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOtp);

export default router