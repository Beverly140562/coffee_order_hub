import React from 'react';
import Logo from "../assets/logo.png";
import { NavLink } from 'react-router';

export default function LoadingPage() {
  return (
    <section className="w-full min-h-screen bg-[#C7AD7F] flex items-center justify-center sm:px-12 py-8">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Right Image */}
        <div className="flex justify-center md:justify-end">
          <div className="w-full h-95 sm:w-96 sm:h-90 md:w-[500px] md:h-[500px] lg:w-[550px] lg:h-[550px] overflow-hidden transform hover:scale-105 transition duration-300">
            <img
              src={Logo}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Left Content */}
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-semibold text-black leading-tight">
            Life begins after a cup of <br />coffee
          </h1>
          <div className="flex flex-col sm:flex-row gap-10 justify-center md:justify-start mt-20 px-15">
            <NavLink
              to="/signup"
              className="text-black px-8 py-4 text-3xl sm:text-2xl font-semibold border shadow-lg transition-transform transform hover:scale-105"
            >
              Sign Up
            </NavLink>
            <NavLink to="/login" className=" text-black px-8 py-4 text-3xl sm:text-2xl font-semibold border shadow-lg transition-transform transform hover:scale-105">
              Sign In
            </NavLink>
          </div>
        </div>

      </div>
    </section>
  );
}
