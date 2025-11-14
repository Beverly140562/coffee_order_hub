import React from "react";
import Navigation from "./Navigation";
import { CircleArrowLeft, CircleArrowRight, LogOut, Package, User } from "lucide-react";
import { NavLink } from "react-router";

function ProfilePage() {
  const username = "NinaRober"; 

  const handleLogout = () => {
    console.log("Logged out");
  };

  return (
    <section className="min-h-screen bg-[#C7AD7F] px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center mb-10 space-x-4">
        <h1 className="text-4xl font-bold text-black flex-1 pb-2">Profile</h1>
      </div>

      <div className="flex items-center mb-10 space-x-4">
  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-white">
    {username.charAt(0)}
  </div>

  <h1 className="text-3xl sm:text-4xl text-black">{username}</h1>
</div>


      <div className="max-w-md mx-auto rounded-xl p-6 flex flex-col gap-4">
  <NavLink  className="w-full flex items-center gap-6 px-4 py-3 rounded hover:bg-gray-100 transition text-2xl font-medium">
    <User size={45} /> Profile
  </NavLink >
  <NavLink to="/checkout"  className="w-full flex items-center gap-6 px-4 py-3 rounded hover:bg-gray-100 transition text-2xl font-medium">
    <Package size={45} /> Your Order
  </NavLink >
  <NavLink 
    to="/signup"
    className="w-full flex items-center gap-6 px-4 py-3 rounded hover:bg-gray-100 transition text-2xl font-medium text-black"
  >
    <LogOut size={45} /> Log Out
  </NavLink >
</div>

      {/* Bottom Navigation */}
      <div className="mt-10 sm:mt-12">
        <Navigation />
      </div>
    </section>
  );
}

export default ProfilePage;
