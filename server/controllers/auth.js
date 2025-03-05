import OTP from "./../models/Otp.js";
import User from "../models/User.js";

import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

export const sendOtp = async (req, res) => {
  const generateOtp = () => {
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  };
  try {
    const otp = generateOtp();
    if (!req.body.email)
      return res.status(400).json({ error: "Email cannot be empty" });

    await OTP.deleteMany({ email: req.body.email });

    const otpBody = await OTP.create({ email: req.body.email, otp });
    res.status(200).json({
      message: "OTP sent successfully",
    });
    console.log(otpBody);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req?.body;

    if (!email || !otp)
      return res.status(400).json({ error: "Email and OTP cannot be empty" });
    const result = await OTP.findOne({ email, otp });

    if (result) {
      const user = await User.findOne({ email: email });
      res.status(200).json({
        success: true,
        user: user?.email,
        message: "OTP verified successfully",
      });
    } else {
      res.status(400).json({ success: false, message: "OTP entered is wrong" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ success: false, error: err.message });
  }
};

export const registerUser = async (req, res) => {
  const user = req.body;
  console.log(user);
  const email = user?.email;

  if (!email) return res.status(400).json({ error: "Email cannot be empty" });
  const result = await User.findOne({ email: email });

  if (result) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  const newUser = await User.create(user);
  const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "180d",
  });
  const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5m",
  });

  console.log(newUser);

  console.log("User saved");
  return res.status(200).json({
    success: true,
    accessToken,
    user: newUser,
    refreshToken,
    message: "User added successfully",
  });
};

export const googleLoginUser = async (req, res) => {
  try {
    const { credential } = req?.body;
    const cred = jwtDecode(credential);
    const email = cred?.email;
    if (email) {
      const user = await User.findOne({ email });
      if (user) {
        const refreshToken = jwt.sign(
          { email },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "180d",
          }
        );
        const accessToken = jwt.sign(
          { email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "5m",
          }
        );
        user.refreshToken = refreshToken;
        await user.save();
        res.status(200).json({
          success: true,
          user: user,
          message: "User logged in successfully",
          hideMessage: true,
          accessToken,
          refreshToken,
        });
      } else {
        res.status(200).json({
          success: false,
          email,
          message: "User does not exist",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Wrong Credentials",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ success: false, error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    console.log(req.body);
    const { email, otp } = req?.body;

    if (!email || !otp)
      return res.status(400).json({
        success: false,
        message: "Email and OTP cannot be empty",
      });
    const result = await OTP.findOne({ email, otp });

    if (result) {
      const user = await User.findOne({ email: email });
      console.log("User logged in successfully");
      if (user) {
        const refreshToken = jwt.sign(
          { email },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "180d",
          }
        );
        const accessToken = jwt.sign(
          { email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "5m",
          }
        );
        user.refreshToken = refreshToken;
        await user.save();
        res.status(200).json({
          success: true,
          user: user,
          message: "User logged in successfully",
          accessToken,
          refreshToken,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "User does not exist",
        });
      }
    } else {
      res.status(400).json({ success: false, message: "OTP entered is wrong" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ success: false, error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          res.status(400).json({ message: "Error while logging out" });
        } else {
          const email = user?.email;
          await User.findOneAndUpdate({ email }, { refreshToken: "" });

          res.status(200).json({ message: "Logged out successfully" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error while logging out" });
  }
};
