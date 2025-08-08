import React from "react";
import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Great for trying Employee Flow with small teams.",
    features: [
      "Up to 5 Employees",
      "Basic Role Management",
      "Email Support",
    ],
    highlight: false,
  },
  {
    name: "Starter",
    price: "$29/mo",
    description: "Perfect for small teams getting started.",
    features: [
      "20 Employees",
      "Role Management",
      "Basic Support",
    ],
    highlight: false,
  },
  {
    name: "Professional",
    price: "$59/mo",
    description: "For growing companies needing more power.",
    features: [
      "50 Employees",
      "Advanced Reporting",
      "Priority Support",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored for large organizations.",
    features: [
      "Unlimited Employees",
      "Dedicated Success Manager",
      "Single Sign-On (SSO)",
    ],
    highlight: false,
  },
];

const Pricing = () => {
  return (
    <section className="bg-base-100 py-20 px-6  border-t border-primary/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-primary mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg font-openSans opacity-90 max-w-2xl mx-auto">
            Flexible pricing for teams of all sizes. Start for free and upgrade as you grow.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.3 }}
              className={`border rounded-2xl shadow-sm hover:shadow-lg transition duration-300 bg-white relative overflow-hidden ${
                plan.highlight ? "border-accent" : "border-primary/10"
              }`}
            >
              {/* Highlight Badge */}
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-accent text-white px-3 py-1 rounded-bl-xl text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <div className="p-6 flex flex-col h-full">
                <h3 className="text-2xl font-bold font-montserrat text-primary mb-2">
                  {plan.name}
                </h3>
                <p className="text-3xl font-bold text-accent mb-4">
                  {plan.price}
                </p>
                <p className="text-secondary opacity-90 mb-6 font-openSans">
                  {plan.description}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-2 text-sm text-secondary">
                      <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-auto bg-primary text-white font-semibold px-4 py-2 rounded-full hover:bg-primary/90 transition cursor-pointer">
                  Get Started
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
