import express from "express";
import {
  createEmergency,
  getEmergencies
} from "../controller/emergencyController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getEmergencies);
router.post("/", protect, createEmergency);

export default router;