import React from "react";
import { Outlet } from "react-router";
import Meating from "../assets/meating.png";
import EmployeeFlow from "./../Components/EmployeeFlow/EmployeeFlow";
import { ToastContainer } from "react-toastify";

const AuthenticationLayout = () => {


  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: Form section */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Optional brand header at top */}
        <div className="p-6">
          <EmployeeFlow />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <Outlet />
        </div>
      </div>
      {/* Right side: Illustration */}
      <div className="hidden lg:flex w-1/2 items-center justify-center">
        <img
          src={Meating}
          alt="Employee Collaboration"
          className="max-w-[80%] object-contain rounded-lg shadow-xl"
        />
      </div>
    </div>
  );
};

export default AuthenticationLayout;
