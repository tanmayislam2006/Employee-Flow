import React from "react";
import { motion } from "framer-motion";
import useAxios from './../../Hook/useAxios';
import { toast } from "react-toastify";

const Contact = () => {
  const axiosInstance = useAxios();
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const message = e.target.message.value;
    // Handle form submission logic here
    axiosInstance.post('/contact', { email, message })
      .then(response => {
        if (response.data.insertedId) {
          toast.success("Message sent successfully!");
          e.target.reset(); // Reset the form
        } else {
          toast.error("Failed to send message. Please try again.");
        }
      })
      .catch(error => {
        console.error("Error sending message:", error);
      });
  };
  return (
    <section className="bg-base-100 min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-montserrat mb-2">
            Contact Us
          </h2>
          <p className="font-openSans opacity-90">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>
        {/* Grid layout */}
        <div className="grid gap-10 md:grid-cols-2">
          {/* Left: Company Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-base-200 border border-primary/10 rounded-2xl p-6 shadow-md"
          >
            <h3 className="text-xl font-semibold text-primary mb-4">Our Address</h3>
            <p className="text-secondary font-openSans mb-2">
              Employee Flow HQ  
              <br />
              123 Business Avenue  
              <br />
              Level 4, Dhaka 1207, Bangladesh  
            </p>
            <p className="text-secondary font-openSans">
              Email: <span className="text-primary">contact@employeeflow.com</span>
            </p>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-base-200 border border-primary/10 rounded-2xl p-6 shadow-md space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-secondary mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows="5"
                required
                className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition cursor-pointer"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
