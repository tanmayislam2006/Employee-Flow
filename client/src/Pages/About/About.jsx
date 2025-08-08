import React from "react";
import { motion } from "framer-motion";
import Logo from "../../assets/logo.png";
const values = [
  {
    title: "Efficiency",
    description: "We streamline HR tasks to save your team time and effort.",
  },
  {
    title: "Transparency",
    description: "Clear role management and reporting for complete visibility.",
  },
  {
    title: "Empowerment",
    description:
      "Tools to help your employees and HR teams do their best work.",
  },
  {
    title: "Support",
    description: "Reliable help and guidance every step of the way.",
  },
];

const About = () => {
  return (
    <section className="bg-base-100 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <img
            src={Logo}
            alt="Employee Flow Logo"
            className="mx-auto w-72 h-auto mb-4"
          />
          <h1 className="text-4xl md:text-5xl font-bold font-montserrat text-primary mb-4">
            About Employee Flow
          </h1>
          <p className="text-lg md:text-xl font-openSans opacity-90 max-w-3xl mx-auto">
            Employee Flow is dedicated to simplifying HR and Employee Management
            for organizations of all sizes. We believe in making complex
            workflows easy, transparent, and efficient.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border border-primary/10 rounded-2xl shadow p-8 md:p-12 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-primary mb-4 text-center">
            Our Mission
          </h2>
          <p className="text-lg md:text-xl font-openSans  max-w-4xl mx-auto text-center">
            To empower companies by providing intuitive tools for managing
            employees, roles, and HR workflows —all in one platform. We aim to
            reduce complexity and help teams focus on what truly matters: their
            people.
          </p>
        </motion.div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-primary text-center mb-10">
            Our Values
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="border border-primary/30 rounded-2xl p-6 shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold font-montserrat text-primary mb-2">
                  {value.title}
                </h3>
                <p className="text-base font-openSans opacity-90">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-primary mb-4">
            Join Us in Shaping the Future of Work
          </h2>
          <p className="text-lg md:text-xl font-openSans opacity-90 max-w-3xl mx-auto mb-6">
            Ready to simplify your HR and Employee Management? Start with
            Employee Flow today.
          </p>
          <button className="bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition">
            Get Started
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
