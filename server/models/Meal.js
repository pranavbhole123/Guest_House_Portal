import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  items: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  reviewers: [
    {
      role: {
        type: String,
        
        default: "ADMIN",
      },
      comments: {
        type: String,
      },
      status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED", "HOLD"],
        default: "PENDING",
      },
    },
  ],
  comments: {
    type: String,
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "HOLD"],
    default: "PENDING",
  },
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation", // Reference to the Reservation model
    default: null,
  },
  dateofbooking: {
    type: Date,
    required: true,
  },
  stepsCompleted: {
    type: Number,
    required: true,
    default: 0,
  },
  payment: {
    source: {
      type: String,
      enum: ["GUEST", "DEPARTMENT", "OTHERS"],
      required: true,
      default: "GUEST",
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },
    paymentId: {
      type: String,
    },
  },
});

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;
