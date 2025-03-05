import React from "react";
import Menu from "../components/Menu";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function Reservation() {
  return (
    <>
      <div className="w-full flex flex-col h-screen">
        <Header />
        <Menu />
        <div className="w-full flex h-screen overflow-hidden">
          <Sidebar />
          <div className="w-full px-9 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Reservation;
