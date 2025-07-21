import React from "react";
import { useNavigate } from "react-router";
import ErrorFile from "../../assets/404-error.json";
import Lottie from "lottie-react";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left flex flex-col items-center">
          <Lottie
            className="max-w-md md:max-w-lg lg:max-w-xl"
            animationData={ErrorFile}
            loop={true}
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

export default Error;