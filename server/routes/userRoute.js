import express from "express";

import { getAllUsers, getUser, updateUser ,getNotifications, deleteNotification, updateRole, deleteAllNotifications} from "../controllers/user.js";


const Router = express.Router();
Router.get("/all", getAllUsers);
Router.get("/notifications", getNotifications)
Router.get("/:id", getUser);

Router.put("/notifications/delete/all", deleteAllNotifications)
Router.put("/notifications/delete/:id", deleteNotification)
Router.put("/updateRole", updateRole);
Router.put("/:id", updateUser);
export default Router;
