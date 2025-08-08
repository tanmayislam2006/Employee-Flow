import React from "react";
import { motion } from "framer-motion";
import { FiUserPlus, FiShield, FiClipboard, FiBarChart2 } from "react-icons/fi";

const steps = [
  {
    number: 1,
    title: "Register Employee / HR",
    description:
      "Start by registering team members with profile details and roles.",
    icon: <FiUserPlus size={28} className="text-accent" />,
  },
  {
    number: 2,
    title: "Assign Roles & Permissions",
    description:
      "Define custom access levels based on department, role, or team needs.",
    icon: <FiShield size={28} className="text-accent" />,
  },
  {
    number: 3,
    title: "Manage Daily Activities",
    description:
      "Track tasks, log attendance, and streamline HR operations daily.",
    icon: <FiClipboard size={28} className="text-accent" />,
  },
  {
    number: 4,
    title: "Track Reports & Data",
    description:
      "View real-time analytics and export detailed reports effortlessly.",
    icon: <FiBarChart2 size={28} className="text-accent" />,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const HowItWorks = () => {
  return (
    <section className="bg-base-100 py-20 px-6 border-t border-primary/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-primary mb-4">
            How Employee Flow Works
          </h2>
          <p className="text-lg font-openSans opacity-90 max-w-2xl mx-auto">
            Follow these simple steps to streamline your HR and Employee Management process.
          </p>
        </div>

        {/* Timeline / Steps */}
        <motion.div
          className="relative grid gap-12 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="relative flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-primary/10 shadow-md hover:shadow-lg transition"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-6 bg-accent text-white font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                {step.number}
              </div>
              {/* Icon */}
              <div className="mt-8 mb-4">{step.icon}</div>
              {/* Title */}
              <h3 className="text-xl font-semibold font-montserrat text-primary mb-2">
                {step.title}
              </h3>
              {/* Description */}
              <p className="text-secondary font-openSans opacity-90">
                {step.description}
              </p>
            </motion.div>
          ))}

        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
