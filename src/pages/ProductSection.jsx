import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "./FavoritesContext";
import cappuccino from "../assets/capuccino.jpg";
import espresso from "../assets/espresso.jpg";
import latte from "../assets/latte.jpg";
import frappe from "../assets/frappe.jpg";
import Americano from "../assets/Caffè_Americano.jpg";
import Misto from "../assets/Caffe Misto.jpg";
import Navigation from "./Navigation";
import Logo from "../assets/logo.png";
import { NavLink } from "react-router";


function ProductSection() {
  const [activeTab, setActiveTab] = useState("Hot Coffee");

  const { addToFavorites, removeFromFavorites, favorites } = useFavorites();

  const products = [
    { id: 1, name: "Cappuccino", desc: "Espresso with chocolate and milk.", img: cappuccino, category: "Hot Coffee" },
    { id: 2, name: "Espresso", desc: "Bold espresso with foamy topping.", img: espresso, category: "Hot Coffee" },
    { id: 3, name: "Latte", desc: "Espresso with steamed milk & a layer of foam.", img: latte, category: "Cold Coffee" },
    { id: 4, name: "Frappuccino", desc: "Iced blend with whipped cream.", img: frappe, category: "Frappuccino" },
    { id: 5, name: "Caffè Americano", desc: "Smooth espresso with water.", img: Americano, category: "Hot Coffee" },
    { id: 6, name: "Caffè Misto", desc: "Rich espresso blend with milk.", img: Misto, category: "Hot Coffee" },
  ];

  const filtered = products.filter((p) => p.category === activeTab);

  const toggleFavorite = (product) => {
    const isFavorited = favorites.some((item) => item.id === product.id);
    if (isFavorited) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  useEffect(() => {
  }, []);

  return (
    <section className="min-h-screen bg-[#C7AD7F] px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl sm:text-2xl m-2 font-bold text-black">Hi, Rober</h1>
          <p className="text-lg text-black m-3">Good ideas start with coffee.</p>
        </div>
        <div className="overflow-hidden pb-4">
          <img src={Logo} alt="Logo" className="w-30 h-30 object-cover" />
        </div>
      </div>

      <div className="flex flex-wrap gap-5 sm:space-x-6 mb-9 justify-center sm:justify-start">
        {["Hot Coffee", "Cold Coffee", "Frappuccino"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-4 rounded-2xl text-sm sm:text-base font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-[#8B4411] text-black shadow-md"
                : "bg-[#FFFFFF] border-3 border-black text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {filtered.map((item) => {
          const isFavorited = favorites.some((f) => f.id === item.id);

          return (
            <div
              key={item.id}
              className="border-2 shadow-md relative overflow-hidden hover:shadow-xl hover:scale-105 transition-transform duration-300 bg-[#C7AD7F]"
            >
              <NavLink to={`/product/${item.id}`}>
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-40 sm:h-40 md:h-48 object-cover"
              />
              </NavLink>

              <button
                onClick={() => toggleFavorite(item)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 transition"
              >
                <Heart
                  size={30}
                  className={`transition-colors ${
                    isFavorited ? "fill-black text-black" : "text-black"
                  }`}
                />
              </button>

              
              <div className="p-2 sm:p-3">
                <h3 className="font-semibold text-xl sm:text-base md:text-lg text-black truncate">
                  {item.name}
                </h3>
                <p className="text-lg sm:text-sm mt-2 text-black line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Nav */}
      <div className="mt-10 sm:mt-12">
        <Navigation />
      </div>
    </section>
  );
}

export default ProductSection;
