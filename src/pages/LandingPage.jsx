import React from "react";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router";

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/landing"); 
  };
  return (
    <section className="w-full min-h-screen bg-[#C7AD7F] flex items-center px-6 sm:px-12 py-8">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Right Image */}
        <div className="flex justify-center md:justify-end">
          <div className="w-100 h-100 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] lg:w-[550px] lg:h-[550px] rounded overflow-hidden transform hover:scale-105 transition duration-300">
            <img
              src={Logo}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Left Content */}
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-6xl sm:text-6xl md:text-5xl pb-25 font-bold text-black leading-tight">
            Enjoy  <br />Your Coffee
          </h1>
          <button onClick={handleGetStarted} className="text-black px-18 py-5 rounded-xl text-4xl font-bold border shadow-lg transition-transform transform hover:scale-105">
            Let's Started
          </button>
        </div>

        
      </div>
    </section>
  );
}

export default LandingPage;
