import React from "react";
import { motion } from "framer-motion";

const OfferSection = () => {
  return (
    <section className="relative overflow-hidden bg-primary text-white py-16 px-6 mx-4 rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
      >
        {/* Left content */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat mb-4">
            Get Started Free for 30 Days
          </h2>
          <p className="text-lg md:text-xl font-openSans opacity-90 max-w-2xl mx-auto md:mx-0">
            No credit card required. Simplify your HR and Employee Management today with our free trial.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex-1 flex justify-center md:justify-end">
          <a
            href="#"
            className="btn btn-accent text-white font-semibold text-lg md:text-xl px-8 py-6 rounded-full shadow-lg hover:opacity-90 transition duration-300"
          >
            Start Free Trial
          </a>
        </div>
      </motion.div>

      {/* Decorative Background Shape */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-20 fill-white">
          <path d="M0,0V120H1200V0C960,80,480,80,0,0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default OfferSection;
