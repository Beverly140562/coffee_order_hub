import { NavLink } from "react-router";
import { Heart, Home, ShoppingCart, User } from "lucide-react";

function Navigation() {
  const icons = [
    { name: "home", icon: Home, path: "/menu" },
    { name: "favorites", icon: Heart, path: "/favorites" },
    { name: "cart", icon: ShoppingCart, path: "/cart" },
    { name: "profile", icon: User, path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#C7AD7F] rounded-t-2xl border-2 border-black flex justify-around py-5 shadow-inner">
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
      ))}
    </div>
  );
}

export default Navigation;
