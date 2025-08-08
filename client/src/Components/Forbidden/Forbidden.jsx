import React from "react";
import { useNavigate } from "react-router";
import ForbiddenFile from "../../assets/forbidden.jpg";
import Lottie from "lottie-react";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left flex flex-col items-center">
          <img
            className="max-w-md"
            src={ForbiddenFile}
          />
          <button
            onClick={() => navigate("/")}
            className="btn btn-primary mt-2"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;