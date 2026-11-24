import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/UserRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";

const app = express();

const port = process.env.PORT || 4001;


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("mongodb connected");
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    process.exit(1);
  }
};


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/user", userRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/emergencies", emergencyRoutes);


app.get("/", (req, res) => {
  res.send("welcome to rokto dai backend");
});

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
};

startServer();