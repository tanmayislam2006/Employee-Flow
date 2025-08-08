import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Daniel",
    message: "Employee Flow made our onboarding so smooth and effortless.",
    img: "https://i.ibb.co/sdTfWPM4/aditya.webp",
  },
  {
    name: "Naura",
    message: "The role management is so easy and intuitive. Highly recommend!",
    img: "https://i.ibb.co/rGd84fSj/daniel.webp",
  },
  {
    name: "Aditya",
    message: "Daily HR tasks are now streamlined and hassle-free.",
    img: "https://i.ibb.co/gZYkv893/naura.webp",
  },
  {
    name: "Sofia",
    message: "Love the analytics and reporting features. Game changer!",
    img: "https://i.ibb.co/sJvSMkD7/man-4.jpg",
  },
  {
    name: "Omar",
    message: "Secure and reliable platform for all our HR needs.",
    img: "https://i.ibb.co/8DPCx6Jb/man-5.jpg",
  },
  {
    name: "Elena",
    message:
      "The customer support team is always so helpful and quick to respond.",
    img: "https://i.ibb.co/zVY4ZLnf/sophia.webp",
  },
  {
    name: "Lucas",
    message: "Integration with our existing HR software was seamless.",
    img: "https://i.ibb.co/w3Rj0Mm/man-1.jpg",
  },
  {
    name: "Maya",
    message: "I love how intuitive and user-friendly the platform is!",
    img: "https://i.ibb.co/jvqZdYrH/man-3.jpg",
  },
  {
    name: "Ethan",
    message: "Reduced our manual HR tasks significantly. Highly efficient!",
    img: "https://i.ibb.co/gMz5Hk0X/man-2.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 px-6 bg-base-100 border-t border-primary/10">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-primary mb-4">
          What Our Clients Say
        </h2>
        <p className="text-lg font-openSans opacity-90 max-w-2xl mx-auto">
          Hear from teams who streamlined their HR with Employee Flow.
        </p>
      </div>

      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        loop={true}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        className="pb-12"
      >
        {testimonials.map((t, index) => (
          <SwiperSlide key={index}>
            <div
              className="flex flex-col items-center bg-white rounded-2xl shadow-lg overflow-hidden border border-primary/10 h-full"
              style={{ minHeight: "380px" }} // uniform card height
            >
              {/* User Photo */}
              <img
                src={t.img}
                alt={t.name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />

              {/* Name and Message Container */}
              <div className="w-full bg-primary/20 backdrop-blur-md px-4 rounded-b-2xl text-center flex flex-col justify-center flex-grow">
                <h3 className="text-lg md:text-xl font-bold font-montserrat text-primary mb-2">
                  {t.name}
                </h3>
                <p className="text-secondary font-openSans opacity-90">
                  {t.message}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;
