import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { privateRequest } from "../utils/useFetch";
import { toast } from "react-toastify";
import { getDate } from "../utils/handleDate";

const NotificationMenu = () => {
  const user = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState(user?.notifications);
  const [status, setStatus] = useState("Success");
  const http = privateRequest(user.accessToken, user.refreshToken);

  const fetchNotifications = async () => {
    try {
      const res = await http.get("/user/notifications");
      setNotifications(res.data);
      setStatus("Success");
    } catch (err) {
      if (err.response?.data?.message) toast.error(err.response.data.message);
      else toast.error("Error fetching notifications");
      setStatus("Error");
      console.log(err.response.data);
    }
  };
  const navigate = useNavigate();

  const handleReservationRedirect = async (res_id, not_id) => {
    try {
      await http.put(`/user/notifications/delete/${not_id}`);
      //redirect to reservation page
      navigate(`/${user.role.toLowerCase()}/reservation/${res_id}`);
      console.log(res_id);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleClearNotifications = async () => {
    try {
      await http.put(`/user/notifications/delete/all`);
      setNotifications([]);
    } catch (error) {
      toast.error(error);
    }
  };

  
  if (!user?.notifications) {

    //if notifications are not loaded
    fetchNotifications();
  } 


  return (
    <div className="absolute z-[999] font-['Dosis'] flex flex-col items-start uppercase right-0 mt-4 w-64 bg-white border border-gray-300 rounded shadow-lg">
      <div className="p-4 w-full">
        <div className="flex justify-between items-baseline">
          <h2 className="text-lg font-bold text-left mb-2">Notifications</h2>
          {notifications.length !==0 && <div className="text-sm cursor-pointer" onClick={handleClearNotifications}>
            CLEAR ALL
          </div>}
        </div>
        {status === "Loading" && (
          <p className="text-sm text-left">Loading...</p>
        )}
        {status === "Success" && notifications.length === 0 && (
          <p className="text-sm text-left">No notifications</p>
        )}
        {notifications.length > 0 && (
          <ul className="max-h-96 overflow-y-auto pr-2">
            {notifications.map((notification) => (
              <li key={"notification-" + notification._id} className="mb-2">
                <div
                  className="bg-gray-100 p-2 rounded cursor-pointer"
                  onClick={() =>
                    handleReservationRedirect(
                      notification.res_id,
                      notification._id
                    )
                  }
                >
                  <p className="text-sm font-semibold">{notification.sender}</p>
                  <p className="text-xs text-gray-500">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    {getDate(notification.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    // need to call a function after clicking on the notification
  );
};

export default NotificationMenu;
