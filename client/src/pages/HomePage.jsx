import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import { Outlet } from "react-router-dom";
import backgroundImage from "../images/backgroundImage.jpeg";

const HomePage = () => {

  return (
    <div
      className="homePage min-h-screen flex flex-col justify-between bg-cover "
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="">
        <Header />
        <Menu />
      </div>
      <div className="flex justify-center min-h-screen overflow-hidden">
        <Outlet />
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
