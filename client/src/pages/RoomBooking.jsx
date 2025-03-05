import React, { useEffect, useState } from "react";
import "./RoomBooking.css";
import { toast } from "react-toastify";
import { privateRequest } from "../utils/useFetch";
import { useSelector } from "react-redux";
import { getDate } from "../utils/handleDate";
import { useLocation, useParams, useResolvedPath } from "react-router-dom";
import RoomList from "../components/RoomList";

const RoomBooking = () => {
  const params = useParams();

  const id = params.id;
  const userRecord = useLocation().state.userRecord;
  const guestName = userRecord.guestName;
  const user = useSelector((state) => state.user);
  const http = privateRequest(user.accessToken, user.refreshToken);
  const room_allot = userRecord.numberOfRooms;

  const fetchRooms = async () => {
    try {
      const res = await http.get("/reservation/rooms");
      const reservation = await http.get("/reservation/" + id);
      setRoomsData(res.data);
      setRoomList(reservation.data.reservation.bookings);
    } catch (error) {
      if (error.response?.data?.message)
        toast.error(error.response.data.message);
      else toast.error("Failed to fetch rooms");
    }
  };
  const convertToDate = (date) => {
    return new Date(new Date(date).toISOString());
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [roomsData, setRoomsData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(userRecord.arrivalDate).toISOString().substring(0, 10)
  );
  const [endDate, setEndDate] = useState(
    new Date(userRecord.departureDate).toISOString().substring(0, 10)
  );
  const [roomList, setRoomList] = useState([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setCounter(roomList.length);
  }, [roomList]);


  useEffect(() => {
    handleFilter();
  }, [startDate, endDate, roomsData]);

  const handleFilter = () => {
    try {
      if (endDate < startDate || endDate === "" || startDate === "") {
        toast.error("Enter Valid endDate and startDate");
        return;
      }

      // Filter the rooms based on the date range
      const updatedRooms = roomsData.map((room) => {
        const filteredBookings = room.bookings.filter((booking) => {
          return (
            convertToDate(booking.startDate) < convertToDate(endDate) &&
            convertToDate(booking.endDate) > convertToDate(startDate)
          );
        });
        return { ...room, bookings: filteredBookings };
      });

      setRooms(updatedRooms)

      // toast.success("Filtered!!");
    } catch (error) {
      console.error("Filter failed:", error);
      toast.error("Filter failed: Please try again later.");
    }
  };

  const addRoom = (room) => {
    if (startDate && endDate) {
      let tempRoomList = [...roomList];

      let temp = false;
      tempRoomList.forEach((currRoom) => {
        if (
          room.roomNumber === currRoom.roomNumber &&
          convertToDate(currRoom.startDate) < convertToDate(endDate) &&
          convertToDate(currRoom.endDate) > convertToDate(startDate)
        ) {
          temp = true;
        }
      });

      if (temp) {
        toast.error("Room already added for this period");
        return;
      }

      let present = false;

      let newRoom = {
        user: guestName,
        startDate,
        endDate,
        roomNumber: room.roomNumber,
      };

      const updatedRoomList = tempRoomList.map((currRoom) => {
        if (currRoom.roomNumber === room.roomNumber && !present) {
          present = true;
          return newRoom;
        }
        return currRoom;
      });

      if (!present) {
        setRoomList((prev) => [...prev, newRoom]);
      } else {
        setRoomList(updatedRoomList);
      }
    } else if (startDate) {
      toast.error("Please give End Date");
    } else if (endDate) {
      toast.error("Please give Start Date");
    } else {
      toast.error("Select Start, End Date");
    }
  };

  return (
    <div className="room-booking h-fit ">
      <h2 className="room-heading text-4xl font-bold">Room Booking</h2>
      <div className="filter-container">

        <div>
          <label className="filter-label">Start Date:</label>
          <input
            type="date"
            value={startDate.substring(0, 10)}
            max={endDate.substring(0, 10)}
            onChange={(e) =>
              setStartDate(new Date(e.target.value).toISOString())
            }
            className="filter-input"
          />
          <label className="filter-label">End Date:</label>
          <input
            type="date"
            value={endDate.substring(0, 10)}
            min={startDate.substring(0, 10)}
            onChange={(e) => setEndDate(new Date(e.target.value).toISOString())}
            className="filter-input"
          />
        </div>
      </div>
      <div className="room-grid">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`room ${room.bookings.length > 0
              ? "booked-during-range cursor-not-allowed rounded-lg bg-[rgb(191,190,190)] text-white"
              : "available cursor-pointer border-[3px] hover:bg-green-500 border-green-500 rounded-lg"
              }`}
          >
            <div
              className="room-info"
              onClick={() => {
                if (counter < room_allot) {
                  setCounter((prevCounter) => {
                    const newCounter = prevCounter + 1;
                    if (newCounter <= room_allot) {
                      addRoom(room);
                      // toast.success(newCounter);
                      toast.success("Room added successfully");
                      console.log(newCounter, "is the counter");
                    } else {
                      toast.error("Alloting more rooms");
                    }
                    return newCounter;
                  });
                } else {
                  toast.error("Alloting more rooms");
                }
              }}

            >
              <h3>{room.roomNumber}</h3>
              {room.bookings.length > 0 && (
                <div className="booking-info">
                  {room.bookings.toReversed().map((booking) => (
                    <div key={"info-" + room.roomNumber} className="py-1">
                      <p>
                        Booked from: {getDate(booking.startDate)} to{" "}
                        {getDate(booking.endDate)}
                      </p>
                      <p>User: {booking.user}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <RoomList roomList={roomList} counter={counter} setCounter={setCounter} setRoomList={setRoomList} id={id} />
    </div>
  );
};

export default RoomBooking;
