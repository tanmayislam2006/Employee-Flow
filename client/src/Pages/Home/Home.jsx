import React from "react";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorks from "./HowItWorks";
import OfferSection from "./OfferSection";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import Pricing from "./Pricing";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <OfferSection/>
      <Pricing/>
      <Testimonials/>
      <FAQ/>
    </div>
  );
};

export default Home;
