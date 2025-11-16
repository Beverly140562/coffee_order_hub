import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router";
import Navigation from "./Navigation";
import Logo from "../assets/logo.png";
import { useFavorites } from "./FavoritesContext";

export default function ProductSection() {
  const [activeTab, setActiveTab] = useState("Hot Coffee");
  const [userName, setUserName] = useState("Guest");
  const navigate = useNavigate();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(savedProducts);

    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser?.first_name) {
      setUserName(savedUser.first_name);
    } else {
      navigate("/signup"); 
    }
  }, []);

  const filteredProducts = products.filter((p) => p.category === activeTab);

  const toggleFavorite = (e, item) => {
    e.stopPropagation(); 
    const isLiked = favorites.some((f) => f.id === item.id);
    if (isLiked) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  };

  return (
    <section className="min-h-screen bg-[#C7AD7F] px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-bold text-black m-2 pt-10">
            Hi, {userName}
          </h1>
          <p className="text-lg text-black mt-3 pl-5">
            Good ideas start with coffee.
          </p>
        </div>
        <img src={Logo} alt="Logo" className="w-33 h-33 object-cover" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mt-3 mb-10">
        {["Hot Coffee", "Cold Coffee", "Frappuccino"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-4 rounded-2xl text-black ${
              activeTab === tab ? "bg-[#8B4411]" : "border-3 bg-white border-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredProducts.map((item) => {
          const isLiked = favorites.some((f) => f.id === item.id);
          return (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="border-2 shadow-md relative overflow-hidden hover:scale-105 transition cursor-pointer"
            >
              <img src={item.image_url} className="w-full h-46 object-cover" />
              <button
                onClick={(e) => toggleFavorite(e, item)}
                className="absolute top-3 right-3 z-10"
              >
                <Heart
                  size={28}
                  className={isLiked ? "fill-black text-black" : "text-black"}
                />
              </button>
              <div className="p-3">
                <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                <p className="text-sm mt-1 line-clamp-2">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Navigation />
    </section>
  );
}
