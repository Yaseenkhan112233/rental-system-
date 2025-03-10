import React from "react";
import Navbar from "./component/Navbar";
import Hero from "./component/Hero";
import FeaturedRentals from "./component/FeaturedRentals";
import CategoryBrowser from "./component/CategoryBrowser";
import HowItWorks from "./component/HowItWorks";
import SafeAndSecure from "./component/SafeAndSecure";
// import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeaturedRentals />
        <CategoryBrowser />
        <HowItWorks />
        <SafeAndSecure />
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
