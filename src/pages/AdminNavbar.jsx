import React from "react";
import { Heart, Home, ShoppingCart, FolderPlus, HardDriveUpload  } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation(); 

  const icons = [
    { name: "home", icon: Home, path: "/home" },
    { name: "product", icon: HardDriveUpload , path: "/add-product" },
    { name: "orders", icon: ShoppingCart, path: "/orders" },
    { name: "admin", icon: FolderPlus, path: "/products" },
  ];

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#C7AD7F] rounded-t-2xl border-2 flex justify-around py-5">
      {icons.map(({ name, icon: Icon, path }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={name}
            onClick={() => handleClick(path)}
            className="flex flex-col items-center transition-colors duration-200"
          >
            <Icon
              size={40}
              stroke={isActive ? "black" : "currentColor"}
              fill={isActive ? "black" : "none"}
              className={`transition-colors duration-200 ${!isActive ? "hover:text-[#8B4513]" : ""}`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default AdminNavbar;