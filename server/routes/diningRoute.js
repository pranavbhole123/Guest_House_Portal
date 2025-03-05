import express from "express";

import {
  createOrder,
  getOrder,
  getOrders,
  getPendingOrders,
  getApprovedOrders,
  getRejectedOrders,
  approveOrder,
  rejectOrder,
  holdOrder,
  updateOrder,
  assignOrder,
  getPaymentPendingDepartmentOrders,
  getPaymentApprovedDepartmentOrders,
  getPaymentPendingGuestOrders,
  getPaymentApprovedGuestOrders,
} from "../controllers/dining.js";

const Router = express.Router();

Router.post("/", createOrder);

Router.get("/all", getOrders);
Router.get("/pending", getPendingOrders);
Router.get("/approved", getApprovedOrders);
Router.get("/rejected", getRejectedOrders);
Router.get("/payment-pending-department", getPaymentPendingDepartmentOrders);
Router.get("/payment-pending-guest", getPaymentPendingGuestOrders);
Router.get("/payment-done-department", getPaymentApprovedDepartmentOrders);
Router.get("/payment-done-guest", getPaymentApprovedGuestOrders);
Router.get("/:id", getOrder);

Router.put("/approve/:id", approveOrder);
Router.put("/reject/:id", rejectOrder);
Router.put("/hold/:id", holdOrder);
Router.put("/:id", updateOrder);

export default Router;
