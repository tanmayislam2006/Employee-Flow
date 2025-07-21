import React from "react";
import { Outlet } from "react-router";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/Navbar/Navbar";

const MainLayout = () => {
  return (
    <div className="">
      <Navbar/>
      <div className="min-h-[calc(100vh-130px)] max-w-7xl mx-auto">
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
};

export default MainLayout;
