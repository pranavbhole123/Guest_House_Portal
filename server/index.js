import dotenv from "dotenv"; 
dotenv.config(); // Load environment variables before anything else

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import { checkAuth } from "./middlewares/tokens.js";
import reservationRoute from "./routes/reservationRoute.js";
import diningRoute from "./routes/diningRoute.js";
import utilsRoute from "./routes/utilsRoute.js";

const app = express();
const port =  4751;

// Ensure logs are visible in production mode
if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
}

// Connect to MongoDB first
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");

    // Initialize GridFsStorage after database connection
    const storage = new GridFsStorage({ url: process.env.MONGO_URL });
    storage.on("connection", () => {
      console.log("GridFsStorage is ready");
    });
    const upload = multer({ storage });

    // Start server only after DB connection
    app.listen(port,"0.0.0.0",() => {
      console.log(`Server is running at port ${port}`);
    });

  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit process if DB connection fails
  }
};

// Start Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Guest House Portal API is running" });
});

app.use("/auth", authRoute);
app.use("/user", checkAuth, userRoute);
app.use("/dining", checkAuth, diningRoute);
app.use("/reservation", checkAuth, reservationRoute);
app.use("/utils", utilsRoute);

app.get("/protected", checkAuth, (req, res) => {
  console.log("Protected route accessed");
  res.json({
    message: "Protected route",
    user: req.body.user,
    accessToken: req.body.newaccessToken,
  });
});
