import React, { useState } from "react";
import { Bell, Heart } from "lucide-react";
import cappuccino from "../assets/capuccino.jpg";
import espresso from "../assets/espresso.jpg";
import latte from "../assets/latte.jpg";
import frappe from "../assets/frappe.jpg";
import Navigation from "./Navigation";
import Logo from "../assets/logo.png";
import Misto from "../assets/Caffe Misto.jpg"
import Americano from "../assets/Caffè_Americano.jpg"


function ProductSection() {
  const [activeTab, setActiveTab] = useState("Hot Coffee");
  const [liked, setLiked] = useState([]);

  const products = [
    {
      name: "Cappuccino",
      desc: "Espresso with chocolate and milk.",
      img: cappuccino,
      category: "Hot Coffee",
    },
    {
      name: "Espresso",
      desc: "Bold espresso with foamy topping.",
      img: espresso,
      category: "Hot Coffee",
    },
    {
      name: "Latte",
      desc: "Espresso with steamed milk & a layer of foam.",
      img: latte,
      category: "Cold Coffee",
    },
    {
      name: "Frappuccino",
      desc: "Iced blend with whipped cream.",
      img: frappe,
      category: "Frappuccino",
    },
    {
      name: "Caffè Americano",
      desc: "Iced blend with whipped cream.",
      img: Americano,
      category: "Hot Coffee",
    },
    {
      name: "Caffè Misto",
      desc: "Iced blend with whipped cream.",
      img: Misto,
      category: "Hot Coffee" ,
    },
  ];

  const filtered = products.filter((p) => p.category === activeTab);

  const toggleLike = (name) => {
    setLiked((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    );
  };

  return (
    <section className="min-h-screen bg-[#C7AD7F] px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl sm:text-2xl m-2 font-bold text-black">
            Hi, Rober
          </h1>
          <p className="text-lg text-black m-3">
            Good ideas start with coffee.
          </p>
        </div>
        <div className="overflow-hidden pb-4">
          <img
            src={Logo} alt="Logo" className="w-30 h-30 object-cover"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-5 sm:space-x-6 mb-9 justify-center sm:justify-start">
        {["Hot Coffee", "Cold Coffee", "Frappuccino"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 sm:px-5 py-4 rounded-2xl text-sm sm:text-base font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-[#8B4411] text-black shadow-md"
                : "bg-[#FFFFFF] border-3 border-black text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {filtered.map((item, idx) => {
          const isLiked = liked.includes(item.name);

          return (
            <div
              key={idx}
              className={`border-2 shadow-md relative overflow-hidden hover:shadow-xl hover:scale-105 transition-transform duration-300 ${
                isLiked ? "bg-[#C7AD7F]" : "bg-[#C7AD7F]"
              }`}
            >
              {/* Product Image */}
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-40 sm:h-40 md:h-48 object-cover"
              />

             
              <button
                onClick={() => toggleLike(item.name)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 transition"
              >
                <Heart
                  size={30}
                  className={`transition-colors ${
                    isLiked
                      ? " fill-black text-black "
                      : "text-black "
                  }`}
                />
              </button>

              {/* Product Info */}
              <div className="p-2 sm:p-3">
                <h3
                  className={`font-semibold text-xl sm:text-base md:text-lg truncate transition-colors ${
                    isLiked ? "text-black" : "text-black"
                  }`}
                >
                  {item.name}
                </h3>
                <p
                  className={`text-lg sm:text-sm mt-2 line-clamp-2 transition-colors ${
                    isLiked ? "text-black" : "text-black"
                  }`}
                >
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
