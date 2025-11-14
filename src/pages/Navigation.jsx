<<<<<<< HEAD
import { NavLink } from "react-router";
import { Heart, Home, ShoppingCart, User } from "lucide-react";

function Navigation() {
  const icons = [
    { name: "home", icon: Home, path: "/menu" },
    { name: "favorites", icon: Heart, path: "/favorites" },
    { name: "cart", icon: ShoppingCart, path: "/cart" },
    { name: "profile", icon: User, path: "/profile" },
=======
import React, { useState } from "react";
import { Heart, Home, ShoppingCart, User } from "lucide-react";

function Navigation() {
  const [active, setActive] = useState("home");

  const icons = [
    { name: "home", icon: Home },
    { name: "favorites", icon: Heart },
    { name: "cart", icon: ShoppingCart },
    { name: "profile", icon: User },
>>>>>>> 7b8ca11e9861644c7542e3d133bee3e120f69390
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#C7AD7F] rounded-t-2xl border-2 border-black flex justify-around py-5 shadow-inner">
<<<<<<< HEAD
      {icons.map(({ name, icon: Icon, path }) => (
        <NavLink
          key={name}
          to={path}
          className={({ isActive }) =>
            `flex flex-col items-center transition-colors duration-200 ${
              isActive ? "text-black" : "text-black hover:text-[#8B4513]"
            }`
          }
        >
          {({ isActive }) => (
            <Icon
              size={40}
              className={`transition-colors duration-200 ${
                isActive ? "stroke-black fill-black" : ""
              }`}
            />
          )}
        </NavLink>
=======
      {icons.map(({ name, icon: Icon }) => (
        <button
          key={name}
          onClick={() => setActive(name)}
          className={`flex flex-col items-center transition-colors duration-200 ${
            active === name
              ? "text-black"
              : "text-black hover:text-[#8B4513]"
          }`}
        >
          <Icon
            size={40}
            className={`transition-colors duration-200 ${
              active === name ? "stroke-black fill-black" : ""
            }`}
          />
        </button>
>>>>>>> 7b8ca11e9861644c7542e3d133bee3e120f69390
      ))}
    </div>
  );
}

export default Navigation;
