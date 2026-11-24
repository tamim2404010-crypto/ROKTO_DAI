
import express from "express";

import {
  getDonors,
  getDonorContact
} from "../controller/donor.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/", getDonors);


router.get("/:id/contact", protect, getDonorContact);

export default router;
