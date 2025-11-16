import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import { LogOut, Package, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ first_name: "", last_name: "", email: "" });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    } else {
      navigate("/signup");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/signup");
  };

  return (
    <section className="min-h-screen bg-[#C7AD7F] px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center mb-10 space-x-4">
        <h1 className="text-4xl font-bold text-black flex-1 pb-2">Profile</h1>
      </div>

      <div className="flex flex-col items-start mb-10 space-y-1">
  <h1 className="text-xl sm:text-4xl text-black">Username: {user.first_name}</h1>
    <h3 className="text-lg text-black">Email: {user.email}</h3>

</div>


      <div className="max-w-md mx-auto rounded-xl p-6 flex flex-col gap-4">
        <NavLink className="w-full flex items-center gap-6 px-4 py-3 rounded hover:bg-gray-100 transition text-2xl font-medium">
          <User size={45} /> Profile
        </NavLink>
        <NavLink to="/product-orders" className="w-full flex items-center gap-6 px-4 py-3 rounded hover:bg-gray-100 transition text-2xl font-medium">
          <Package size={45} /> Your Order
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-6 px-4 py-3 rounded hover:bg-gray-100 transition text-2xl font-medium text-black"
        >
          <LogOut size={45} /> Log Out
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-10 sm:mt-12">
        <Navigation />
      </div>
    </section>
  );
}

export default ProfilePage;
