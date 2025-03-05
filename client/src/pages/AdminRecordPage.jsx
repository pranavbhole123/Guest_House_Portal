import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useParams } from "react-router-dom";
import Workflow from "../components/Workflow";
import { privateRequest } from "../utils/useFetch";
import { getDate, getTime } from "../utils/handleDate";
import "react-toastify/dist/ReactToastify.min.css";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
export default function AdminRecordPage() {
  const { id } = useParams();

  const user = useSelector((state) => state.user);

  const http = privateRequest(user.accessToken, user.refreshToken);

  const [status, setStatus] = useState("Loading");

  const [totalDiningFare, setTotalDiningFare] = useState(0);
  const [totalRoomFare, setTotalRoomFare] = useState(0);
  const [totalFare, setTotalFare] = useState(0);
  const [isEdit, setIsEdit] = useState(false);

  const color = {
    PENDING: "bg-gray-400",
    APPROVED: "bg-green-400",
    REJECTED: "bg-red-400",
    HOLD: "bg-yellow-400",
  };

  const [reviewers, setReviewers] = useState([]);

  const [userRecord, setUserRecord] = useState({
    guestName: "",
    address: "",
    numberOfGuests: "",
    numberOfRooms: "",
    roomType: "",
    arrivalDate: "",
    departureDate: "",
    purpose: "",
    category: "",
  });
  const [checkedValues, setCheckedValues] = useState([]);

  const roles = [
    "DIRECTOR",
    "HOD",
    "DEAN",
    "REGISTRAR",
    "CHAIRMAN",
    "ASSOCIATE DEAN",
  ];

  const roomPricesB = { "Single Occupancy": 600, "Double Occupancy": 850 };
  const roomPricesC = { "Single Occupancy": 900, "Double Occupancy": 1250 };
  const roomPricesD = { "Single Occupancy": 1300, "Double Occupancy": 1800 };

  useEffect(() => {
    const fetchRecord = async () => {
      console.log("fetching record...");
      try {
        const response = await http.get(`/reservation/${id}`);
        setStatus("Success");
        setUserRecord(response.data.reservation);
        setReviewers(response.data.reservation.reviewers);
        console.log(response.data);
        setCheckedValues(
          response.data.reservation.reviewers.map(
            (reviewer) => reviewer.role
          ) || []
        );
      } catch (error) {
        setStatus("Error");
        console.error("Error fetching user data:", error);
      }
    };

    const getDiningAmount = async () => {
      try {
        const response = await http.post(`/reservation/${id}`, {
          id: id,
        });
        setTotalDiningFare(response.data.totalAmount);
      } catch (error) {
        setStatus("Error");
        console.error("Error total Dining Amount:", error);
      }
    };

    getDiningAmount();

    fetchRecord();
  }, [id]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCheckedValues((prevCheckedValues) => [...prevCheckedValues, value]);
    } else {
      setCheckedValues((prevCheckedValues) =>
        prevCheckedValues.filter((item) => item !== value)
      );
    }
  };

  if (status === "Error") return <Navigate to="/404" />;
  else if (status === "Loading")
    return (
      <div className="flex h-full w-full text-xl font-semibold items-center justify-center">
        Loading...
      </div>
    );

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    setUserRecord({ ...userRecord, [e.target.name]: e.target.value });
  };
  const getTime2 = (dateString) => {
    const date = new Date(dateString);

    // Extracting hours, minutes, and seconds
    const hours24 = date.getHours();
    const minutes = ("0" + date.getMinutes()).slice(-2); // Add leading zero if needed

    // Converting to 12-hour format
    const hours12 = ("0" + hours24).slice(-2);

    // Formatting time in 12-hour clock format
    const time = `${hours12}:${minutes}`;

    return time;
  };

  return (
    <>
      <div className="mx-9 mt-9 flex gap-5">
        {user.role === "ADMIN" && (
          <Link
            state={{ userRecord: userRecord }}
            className="p-2 bg-[rgb(54,88,153)] rounded-lg text-white"
            to={"rooms"}
          >
            Room Booking
          </Link>
        )}
        {user.role === "ADMIN" && userRecord.byAdmin && (
          <div
            className="p-2 px-4 bg-[rgb(54,88,153)] rounded-lg text-white cursor-pointer"
            onClick={() => setIsEdit(!isEdit)}
          >
            {isEdit ? (
              <div className="flex items-center">
                <SaveIcon
                  fontSize="small"
                  onClick={async () => {
                    try {
                      const response = await http.put(
                        `/reservation/${id}`,
                        userRecord
                      );
                      console.log(response.data);
                      setIsEdit(false);
                    } catch (error) {}
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center">
                <EditIcon fontSize="small" />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="grid grid-cols-8 m-9 gap-4">
        <Workflow
          id={id}
          userRecord={userRecord}
          setUserRecord={setUserRecord}
          reviewers={reviewers}
          setReviewers={setReviewers}
        />

        {userRecord.byAdmin && isEdit ? (
          <div className='col-span-5 shadow-lg flex flex-col overflow-auto justify-center gap-4 font-["Dosis"] bg-[rgba(255,255,255,0.5)] rounded-lg pt-4'>
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Guest Name:</p>
              <input
                name="guestName"
                className="px-2 border-gray-700 rounded-md"
                value={userRecord.guestName}
                onChange={handleChange}
              ></input>
              {/* <p className="p-2 text-lg">{userRecord.guestName}</p> */}
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Applicant Name:</p>
              <input
                name="numberOfGuests"
                className="px-2 border-gray-700 rounded-md"
                value={userRecord.applicant?userRecord.applicant.name:'N/A'}
                onChange={handleChange}
              ></input>
            </div>
            <hr />
            {/* <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Address:</p>
              <input
                name="address"
                className="px-2 border-gray-700 rounded-md"
                value={userRecord.address}
                onChange={handleChange}
              ></input>
            </div>
            <hr /> */}
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Number Of Guests:</p>
              <input
                name="numberOfGuests"
                className="px-2 border-gray-700 rounded-md"
                value={userRecord.numberOfGuests}
                onChange={handleChange}
              ></input>
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Number Of Rooms:</p>
              <input
                name="numberOfRooms"
                className="px-2 border-gray-700 rounded-md"
                value={userRecord.numberOfRooms}
                onChange={handleChange}
              ></input>
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Room Type</p>
              <select
                name="roomType"
                className=" h-12 border-2 rounded-md border-gray-700 p-2 whitespace-pre"
                onChange={handleChange}
                value={userRecord.roomType}
              >
                <option className="" value="Single Occupancy">
                  Single Occupancy
                </option>
                <option className="" value="Double Occupancy">
                  Double Occupancy
                </option>
              </select>
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Arrival Date</p>
              <input
                type="date"
                name="arrivalDate"
                value={userRecord.arrivalDate.split("T")[0]}
                className="border-gray-700 rounded-md px-2"
                onChange={(e) =>
                  setUserRecord((prev) => ({
                    ...prev,
                    arrivalDate:
                      e.target.value + "T" + prev.arrivalDate.split("T")[1],
                  }))
                }
              />
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Arrival Time:</p>
              <input
                type="time"
                name="arrivalTime"
                className="px-2 border-gray-700 rounded-md"
                value={getTime2(userRecord.arrivalDate)}
                onChange={(e) =>
                  setUserRecord((prev) => ({
                    ...prev,
                    arrivalDate:
                      prev.arrivalDate.split("T")[0] + "T" + e.target.value,
                  }))
                }
              ></input>
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Departure Date:</p>
              <input
                type="date"
                name="departureDate"
                className="border-gray-700 rounded-md px-2"
                value={userRecord.departureDate.split("T")[0]}
                onChange={(e) =>
                  setUserRecord((prev) => ({
                    ...prev,
                    departureDate:
                      e.target.value + "T" + prev.departureDate.split("T")[1],
                  }))
                }
              />
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Departure Time:</p>
              <input
                type="time"
                name="departureTime"
                className="px-2 border-gray-700 rounded-md"
                value={getTime2(userRecord.departureDate)}
                onChange={(e) =>
                  setUserRecord((prev) => ({
                    ...prev,
                    departureDate:
                      prev.departureDate.split("T")[0] + "T" + e.target.value,
                  }))
                }
              ></input>
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Purpose:</p>
              <input
                name="purpose"
                className="px-2 border-gray-700 rounded-md"
                value={userRecord.purpose}
                onChange={handleChange}
              ></input>
            </div>
            <hr />
            <div className="flex justify-between px-32 pb-5">
              <p className="p-2 text-xl font-semibold">Category:</p>
              <p className="p-2 text-lg">{userRecord.category}</p>
            </div>
            <hr />
            <div className="flex justify-between px-32 pb-5">
              <p className="p-2 text-xl font-semibold">Room Fare:</p>
              <p className="p-2 text-lg">
                Rs. {userRecord.payment.amount || 0}/- only
              </p>
            </div>
            <div className="flex justify-between px-32 pb-5">
              <p className="p-2 text-xl font-semibold">Dining Fare:</p>
              <p className="p-2 text-lg">Rs. {totalDiningFare}/- only</p>
            </div>
            <div className="flex justify-between px-32 pb-5">
              <p className="p-2 text-xl font-semibold">Total Amount:</p>
              <p className="p-2 text-lg">
                Rs. {totalDiningFare + (userRecord.payment.amount || 0)}/- only
              </p>
            </div>
          </div>
        ) : (
          <div className='col-span-5 shadow-lg flex flex-col overflow-auto justify-center gap-4 font-["Dosis"] bg-[rgba(255,255,255,0.5)] rounded-lg pt-4'>
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Guest Name:</p>
              <p className="p-2 text-lg">{userRecord.guestName}</p>
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Address:</p>
              <p className="p-2 text-lg">{userRecord.address}</p>
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Number Of Guests:</p>
              <p className="p-2 text-lg">{userRecord.numberOfGuests}</p>
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Number Of Rooms:</p>
              <p className="p-2 text-lg">{userRecord.numberOfRooms}</p>
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Room Type</p>
              <p className="p-2 text-lg">{userRecord.roomType}</p>
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Arrival Date</p>
              <p className="p-2 text-lg">{getDate(userRecord.arrivalDate)}</p>
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Arrival Time:</p>

              <p className="p-2 text-lg">{getTime(userRecord.arrivalDate)}</p>
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Departure Date:</p>
              <p className="p-2 text-lg">{getDate(userRecord.departureDate)}</p>
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Departure Time:</p>
              <p className="p-2 text-lg">{getTime(userRecord.departureDate)}</p>
            </div>
            <hr />
            <div className="flex justify-between px-32">
              <p className="p-2 text-xl font-semibold">Purpose:</p>
              <p className="p-2 text-lg">{userRecord.purpose}</p>
            </div>
            <hr />
            <div className="flex justify-between px-32 pb-5">
              <p className="p-2 text-xl font-semibold">Category:</p>
              <p className="p-2 text-lg">{userRecord.category}</p>
            </div>
            <hr />
            <div className="flex justify-between px-32 pb-5">
              <p className="p-2 text-xl font-semibold">Room Fare:</p>
              <p className="p-2 text-lg">
                Rs. {userRecord.payment.amount || 0}/- only
              </p>
            </div>
            <div className="flex justify-between px-32 pb-5">
              <p className="p-2 text-xl font-semibold">Dining Fare:</p>
              <p className="p-2 text-lg">Rs. {totalDiningFare}/- only</p>
            </div>
            <div className="flex justify-between px-32 pb-5">
              <p className="p-2 text-xl font-semibold">Total Amount:</p>
              <p className="p-2 text-lg">
                Rs. {(userRecord.payment.amount || 0) + totalDiningFare}/- only
              </p>
            </div>
          </div>
        )}
      </div>
      <div className='col-span-5 md:flex-col overflow-auto shadow-lg flex justify-between p-5  gap-4 m-9 font-["Dosis"] bg-[rgba(255,255,255,0.5)] rounded-lg'>
        <div>
          <div className="text-2xl font-semibold font-['Dosis'] px-5">
            Status
          </div>
          <div className="p-5 flex flex-col gap-4 ">
            {reviewers.map((reviewer) => (
              <div className="flex gap-4 w-max">
                <div className="w-56">{reviewer.role}</div>
                <div
                  className={
                    "border rounded-full relative top-1 w-5 h-5 " +
                    color[reviewer.status]
                  }
                ></div>
                <div className="w-72">{reviewer.comments}</div>
              </div>
            ))}
          </div>
        </div>
        {userRecord.bookings?.length > 0 && (
          <div>
            <div className="text-2xl text-center font-semibold font-['Dosis'] px-5">
              Rooms Assigned
            </div>
            <div className="p-5 flex flex-col gap-4 ">
              <div className="flex gap-4 font-semibold text-center">
                <div className="w-24">Start Date</div>
                <div className="w-24">End Date</div>
                <div className="w-24">Room Number</div>
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto max-h-28">
                {userRecord.bookings.map((booking) => (
                  <div className="flex gap-4 text-center">
                    <div className="w-24">{getDate(booking.startDate)}</div>
                    <div className="w-24">{getDate(booking.endDate)}</div>
                    <div className="w-20">{booking.roomNumber}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <div className='col-span-5 md:flex-col overflow-auto shadow-lg flex justify-between  p-5  gap-4 m-9 font-["Dosis"] bg-[rgba(255,255,255,0.5)] rounded-lg'>
        
      </div> */}
    </>
  );
}
