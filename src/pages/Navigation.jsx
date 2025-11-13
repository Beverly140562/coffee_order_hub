import React, { useState } from "react";
import { Heart, Home, ShoppingCart, User } from "lucide-react";

function Navigation() {
  const [active, setActive] = useState("home");

  const icons = [
    { name: "home", icon: Home },
    { name: "favorites", icon: Heart },
    { name: "cart", icon: ShoppingCart },
    { name: "profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#C7AD7F] rounded-t-2xl border-2 border-black flex justify-around py-5 shadow-inner">
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
      ))}
    </div>
  );
}

export default Navigation;
