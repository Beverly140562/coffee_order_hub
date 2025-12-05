import React, { useEffect, useState } from "react";
import { Heart, Home, ShoppingCart, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { supabase } from "../config/supabase";

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeOrders, setActiveOrders] = useState([]); 
  const [lastSeenStatus, setLastSeenStatus] = useState({});
  const [animateBadge, setAnimateBadge] = useState(false);
  const [hasNewUpdate, setHasNewUpdate] = useState(false);

  const icons = [
    { name: "menu", icon: Home, path: "/menu" },
    { name: "favorites", icon: Heart, path: "/favorites" },
    { name: "cart", icon: ShoppingCart, path: "/cart" },
    { name: "profile", icon: User, path: "/profile" },
  ];

  const fetchOrders = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) return;

    const { data: orders } = await supabase
      .from("orders")
      .select("id, status")
      .eq("user_id", user.id)
      .in("status", ["Pending", "Processing", "Ready for Pickup", "Completed","Cancelled"]);

    const allOrders = orders || [];

    const nonCompletedOrders = allOrders.filter(o => o.status !== "Completed");

    let newUpdate = false;
    const updatedStatusMap = { ...lastSeenStatus };
    allOrders.forEach(order => {
      if (lastSeenStatus[order.id] && lastSeenStatus[order.id] !== order.status) {
        newUpdate = true;
      }
      updatedStatusMap[order.id] = order.status;
    });

    setLastSeenStatus(updatedStatusMap);
    setActiveOrders(nonCompletedOrders);

    if (newUpdate) {
      setAnimateBadge(true);
      setHasNewUpdate(true);
      setTimeout(() => setAnimateBadge(false), 1000);
    }

    if (location.pathname === "/product-orders" && nonCompletedOrders.length === 0) {
      navigate("/cart");
      setHasNewUpdate(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [location.pathname, lastSeenStatus]);

  const handleClick = (icon) => {
    if (icon.name === "cart") {
      navigate("/cart");
      setHasNewUpdate(false);
    } else {
      navigate(icon.path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#C7AD7F] rounded-t-2xl border-2 flex justify-around py-5">
      {icons.map((icon) => {
        const isActive = location.pathname === icon.path;
        return (
          <div key={icon.name} className="relative">
            <button
              onClick={() => handleClick(icon)}
              className="flex flex-col items-center transition-colors duration-200"
            >
              <icon.icon
                size={40}
                stroke={isActive ? "black" : "currentColor"}
                fill={isActive ? "black" : "none"}
                className={`transition-colors duration-200 ${!isActive ? "hover:text-[#8B4513]" : ""}`}
              />
            </button>

            {icon.name === "cart" && activeOrders.length > 0 && hasNewUpdate && (
              <span
                className={`absolute -top-1 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold ${
                  animateBadge ? "animate-badge" : ""
                }`}
              >
                {activeOrders.length}
              </span>
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.4); }
        }
        .animate-badge {
          animation: badgePulse 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Navigation;
