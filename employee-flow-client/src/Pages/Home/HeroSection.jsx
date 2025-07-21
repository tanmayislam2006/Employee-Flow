import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden ">
      {/* Top Decorative Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-[120px] fill-primary opacity-15"
        >
          <path d="M0,0V30C120,50,240,60,360,50C480,40,600,20,720,30C840,40,960,60,1080,60C1200,60,1200,0,1200,0Z"></path>
        </svg>
      </div>

      {/* Bottom Decorative Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-[100px] fill-accent opacity-10"
        >
          <path d="M0,0V120H1200V0C960,80,480,80,0,0Z"></path>
        </svg>
      </div>

      {/* Optional subtle overlay */}
      <div className="absolute inset-0 bg-primary/10 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 md:py-10 lg:py-16">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 mb-12 md:mb-0 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold leading-tight mb-6">
            Simplify <span className="text-accent">Employee & HR</span>{" "}
            Management
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-openSans max-w-2xl mx-auto md:mx-0 mb-8 opacity-90">
            Organize and empower your team with seamless registration, smart
            role assignments, and efficient workflow management—all in one
            platform.
          </p>
          <button className="btn btn-accent text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-6 rounded-full shadow hover:opacity-90 transition duration-300">
            Get Started
          </button>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex justify-center"
        >
          <img
            src="https://i.ibb.co/gMpCn7X3/banner-image.jpg"
            alt="Employee Flow app dashboard screenshot"
            className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto rounded-xl shadow-2xl object-cover"
            loading="lazy"
          />
        </motion.div>
      </div>
      {/* Scroll Down Arrow */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <svg
          className="w-8 h-8 text-accent animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
