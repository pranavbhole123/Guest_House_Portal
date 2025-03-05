import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./DiningSidebar.module.css"; // Ensure CSS Module is correctly imported
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const DiningSidebar = () => {
  // Accept isOpen as prop

  const user = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(true);

  if (!user.email) {
    return <Navigate to="/login" />;
  }

  const content =
    user.role === "ADMIN"
      ? ["Pending Requests", "Rejected Requests", "Approved Requests"]
      : user.role === "USER"
      ? [
          "Pending Requests",
          "Rejected Requests",
          "Approved Requests",
          "Book Dining",
          "Cart",
        ]
      : user.role === "CASHIER"
      ? [
          "Payment Pending Department",
          "Payment Pending Guest",
          "Payment Done Guest",
          "Payment Done Department",
        ] // other roles
      : ["Pending Requests", "Rejected Requests", "Approved Requests"];

  return (
    <div className="flex flex-col">
      <div
        className={
          "absolute top-28 text-white left-4 z-20 text-xl flex gap-2 items-baseline" +
          styles.menuIcon
        }
      >
        <div
          className="cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          ☰
        </div>
      </div>
      <hr></hr>
      <div
        className={
          "text-white " + `${styles.sidebar} ${!isOpen ? styles.closed : ""}`
        }
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "all 0.2s",
        }}
      >
        <ul
          className={
            styles["sidebar-menu"] +
            `${isOpen ? "" : styles["sidebar-menu-closed"]}`
          }
        >
          {content.map((item, index) => (
            <Link
              className=""
              to={
                item === "Pending Requests"
                  ? ""
                  : item === "Payment Pending Department"
                  ? "payment-pending-department"
                  : item === "Payment Pending Guest"
                  ? "payment-pending-guest"
                  : item === "Payment Done Guest"
                  ? "payment-done-guest"
                  : item === "Payment Done Department"
                  ? "payment-done-department"
                  : `${item.toLowerCase().replace(" ", "-")}`
              }
            >
              <li className={" " + styles["menu-item"]} key={index}>
                {item}
              </li>
              <hr></hr>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DiningSidebar;
