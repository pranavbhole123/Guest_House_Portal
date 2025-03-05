import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className=" text-3xl">403 Forbidden</div>
      <div className=" text-xl">You cannot access this page!</div>
      <div
        className="cursor-pointer"
        onClick={() => {
          navigate(-2);
        }}
      >
        Go back
      </div>
      <Link to="/">Go Home</Link>
    </div>
  );
};

export default Unauthorized;
