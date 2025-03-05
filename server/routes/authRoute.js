import {
  googleLoginUser,
  loginUser,
  logoutUser,
  registerUser,
  sendOtp,
  verifyOtp,
} from "../controllers/auth.js";

import express from "express";

const Router = express.Router();

Router.post("/otp", sendOtp);
Router.post("/verifyOTP", verifyOtp);
Router.post("/register", registerUser);
Router.post("/login", loginUser);
Router.post("/googleLogin", googleLoginUser);
Router.get("/logout", logoutUser);

export default Router;
