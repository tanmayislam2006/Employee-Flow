import React from "react";
// Headless UI Disclosure gives you accessible, animated accordion behavior
import { Disclosure } from "@headlessui/react";
// Chevron icon for expand/collapse indicator
import { FiChevronDown } from "react-icons/fi";

const faqs = [
  // The FAQ data (question and answer text)
  {
    question: "What is Employee Flow?",
    answer:
      "Employee Flow is a modern HR and Employee Management platform that helps you register employees, assign roles, track tasks, and streamline your HR workflows—all in one place.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! We offer a 30-day free trial with full access to all features. No credit card required.",
  },
  {
    question: "How secure is my data?",
    answer:
      "Your data is protected with advanced encryption and role-based access controls. We prioritize privacy and security for all organizations.",
  },
  {
    question: "Can I manage both Employees and HR roles?",
    answer:
      "Absolutely. Employee Flow is designed for flexible role management, so you can easily switch between employee and HR workflows.",
  },
  {
    question: "Do I need technical skills to use it?",
    answer:
      "No! Employee Flow has an intuitive, user-friendly interface that makes it easy for anyone to use without special technical knowledge.",
  },
  {
    question: "How do I get support?",
    answer:
      "Our dedicated support team is available 24/7 via chat and email to help with any questions or issues.",
  },
];

const FAQ = () => {
  return (
    <section className="bg-base-100 py-20 px-6 border-t border-primary/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg font-openSans opacity-90 max-w-2xl mx-auto">
            Find answers to common questions about Employee Flow and how it
            works for your team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Disclosure key={index}>
              {({ open }) => (
                <div className="border border-primary/10 rounded-xl overflow-hidden">
                  
                  {/* Disclosure.Button is the clickable header of the accordion.
                      It toggles the open/closed state. */}
                  <Disclosure.Button
                    className="flex w-full justify-between items-center px-6 py-4 bg-white hover:bg-primary/5 transition font-semibold text-left font-montserrat text-primary"
                  >
                    <span>{faq.question}</span>
                    
                    {/* Icon rotates when the section is open */}
                    <FiChevronDown
                      className={`transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                      size={24}
                    />
                  </Disclosure.Button>

                  {/* Disclosure.Panel is the collapsible content area.
                      It only renders when open. */}
                  <Disclosure.Panel className="px-6 py-4 bg-primary/5 font-openSans opacity-90">
                    {faq.answer}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
