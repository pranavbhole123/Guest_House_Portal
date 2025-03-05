import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: true,
  },
  bookings: [
    {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      user: {
        type: String,
      },
    },
  ],
});

export default mongoose.model("Room", RoomSchema);
