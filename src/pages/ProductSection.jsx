
import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router";
import Navigation from "./Navigation";
import Logo from "../assets/logo.png";
import { useFavorites } from "./FavoritesContext";

import cappuccino from "../assets/capuccino.jpg";
import espresso from "../assets/espresso.jpg";
import latte from "../assets/latte.jpg";
import frappe from "../assets/frappe.jpg";
import Misto from "../assets/Caffe Misto.jpg";
import Americano from "../assets/Caffè_Americano.jpg";

export default function ProductSection() {
  const [activeTab, setActiveTab] = useState("Hot Coffee");
  const navigate = useNavigate();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const products = [
    { id: 1, name: "Cappuccino", desc: "Espresso with chocolate and milk.", img: cappuccino, category: "Hot Coffee" },
    { id: 2, name: "Espresso", desc: "Bold espresso with a foamy topping.", img: espresso, category: "Hot Coffee" },
    { id: 3, name: "Latte", desc: "Espresso with steamed milk.", img: latte, category: "Cold Coffee" },
    { id: 4, name: "Frappuccino", desc: "Iced blend with whipped cream.", img: frappe, category: "Frappuccino" },
    { id: 5, name: "Caffè Americano", desc: "Espresso with hot water.", img: Americano, category: "Hot Coffee" },
    { id: 6, name: "Caffè Misto", desc: "Espresso blend with milk.", img: Misto, category: "Hot Coffee" },
  ];

  const filtered = products.filter((p) => p.category === activeTab);

  const toggleFavorite = (e, item) => {
    e.stopPropagation(); // important to prevent navigation when clicking favorite

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
          <h1 className="text-5xl font-bold text-black m-2">Hi, Rober</h1>
          <p className="text-lg text-black m-3">Good ideas start with coffee.</p>
        </div>
        <img src={Logo} alt="Logo" className="w-20 h-20 object-cover" />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mt-6 mb-10">
        {["Hot Coffee", "Cold Coffee", "Frappuccino"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 rounded-2xl border-2 text-black ${
              activeTab === tab ? "bg-[#8B4411]" : "bg-white border-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const isLiked = favorites.some((f) => f.id === item.id);

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="border-2 shadow-md relative overflow-hidden bg-white rounded-xl hover:scale-105 transition cursor-pointer"
            >
              <img src={item.img} className="w-full h-40 object-cover" />

              {/* Favorite Button */}
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
                <p className="text-sm mt-1 line-clamp-2">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Navigation />
    </section>
  );
}
