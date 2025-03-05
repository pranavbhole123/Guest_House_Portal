import express from "express";
import { upload, checkFileSize } from "../middlewares/fileStore.js";

import {
  createReservation,
  getReservationDetails,
  approveReservation,
  getAllReservationDetails,
  rejectReservation,
  holdReservation,
  getPendingReservations,
  getApprovedReservations,
  getRejectedReservations,
  getReservationDocuments,
  updateReservation,
  getRooms,
  addRoom,
  deleteRoom,
  updateRooms,
  sendNotification,
  updatePaymentStatus,
  getCurrentReservations,
  getPaymentPendingReservations,
  getCheckedOutReservations,
  getLateCheckoutReservations,
  checkoutReservation,
  checkoutToday,
  getDiningAmount,
  deleteReservations,
} from "../controllers/reservation.js";

const Router = express.Router();

Router.post(
  "/",
  checkFileSize,
  upload.fields([
    { name: "files", maxCount: 5 },
    { name: "receipt", maxCount: 1 },
  ]),
  createReservation
);

Router.get("/all", getAllReservationDetails);
Router.get("/current", getCurrentReservations);
Router.get("/late", getLateCheckoutReservations);
Router.get("/checkedout", getCheckedOutReservations);
Router.get("/pending", getPendingReservations);
Router.get("/approved", getApprovedReservations);
Router.get("/rejected", getRejectedReservations);
Router.get("/documents/:id", getReservationDocuments);
Router.get("/rooms", getRooms);
Router.get("/payment/pending", getPaymentPendingReservations);
Router.get("/checkout/today", checkoutToday);
Router.get("/:id", getReservationDetails);

Router.put("/checkout/:id", checkoutReservation);
Router.put("/rooms/:id", updateRooms);
Router.put("/approve/:id", approveReservation);
Router.put("/reject/:id", rejectReservation); 
Router.put("/hold/:id", holdReservation);
Router.put("/payment/:id", updatePaymentStatus);
Router.put("/:id", updateReservation);

Router.post("/rooms", addRoom);
Router.post("/:id", getDiningAmount);

Router.delete("/rooms", deleteRoom);
Router.delete("/", deleteReservations);

export default Router;
