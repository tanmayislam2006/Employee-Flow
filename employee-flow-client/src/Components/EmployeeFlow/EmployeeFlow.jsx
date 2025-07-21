import React from "react";
import { Link } from "react-router";
import Logo from "../../assets/logo.png";
const EmployeeFlow = () => {
  return (
    <Link className="flex items-center" to={"/"}>
      <img
        src={Logo}
        className="w-10 h-10 mr-2"
        alt="Employee Flow Logo"
      />
      <h3 className="hidden md:block text-lg font-bold text-primary">Employee Flow</h3>
    </Link>
  );
};

export default EmployeeFlow;
