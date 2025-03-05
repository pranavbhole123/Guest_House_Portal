import express from "express";
import { sendMail } from "../controllers/utils.js";

const Router = express.Router();
Router.post("/mail", sendMail);
export default Router;
