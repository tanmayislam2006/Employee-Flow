import React from "react";
import { motion } from "framer-motion";
import {  FiLock, FiHeadphones, FiLayers } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";

const features = [
  {
    title: "Employee Data Security",
    description:
      "Protect sensitive employee information with advanced encryption and role-based access.",
    icon: <FiLock size={40} className="text-accent" />,
  },
  {
    title: "Advanced HR Dashboard",
    description:
      "Get a comprehensive view of your workforce with custom analytics and reports.",
    icon: <MdDashboard size={40} className="text-accent" />,
  },
  {
    title: "24/7 Support",
    description:
      "Get help whenever you need it with our dedicated support team ready to assist.",
    icon: <FiHeadphones size={40} className="text-accent" />,
  },
  {
    title: "Easy Integrations",
    description:
      "Connect with your existing tools and systems for a seamless HR experience.",
    icon: <FiLayers size={40} className="text-accent" />,
  },
];


const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05 },
};

const FeaturesSection = () => {
  return (
    <section className="bg-base-100 py-16 px-6 md:px-6 border-t border-primary/20">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-primary mb-4">
            Core Features of Employee Flow
          </h2>
          <p className="max-w-2xl mx-auto text-lg font-openSans opacity-90">
            Streamline HR processes with these essential tools to empower your team and simplify management.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white border border-primary/10 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition-transform duration-300"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold font-montserrat text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-secondary font-openSans opacity-90">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
