import React, { useState, useEffect } from "react";
import { ChevronLeft, Heart } from "lucide-react";
import { NavLink, useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useFavorites } from "./FavoritesContext";
import cappuccino from "../assets/capuccino.jpg";
import espresso from "../assets/espresso.jpg";
import latte from "../assets/latte.jpg";
import frappe from "../assets/frappe.jpg";
import Americano from "../assets/Caffè_Americano.jpg";
import Misto from "../assets/Caffe Misto.jpg";

export default function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("S");

  const navigate = useNavigate();
  const { id } = useParams();

  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites(); 

  const products = [
    { id: 1, name: "Cappuccino", desc: "Espresso with chocolate and milk.", img: cappuccino, price: 150 },
    { id: 2, name: "Espresso", desc: "Bold espresso with foamy topping.", img: espresso, price: 100 },
    { id: 3, name: "Latte", desc: "Caffè Misto is a smooth coffee with steamed milk.", img: latte, price: 140 },
    { id: 4, name: "Frappuccino", desc: "Iced blend with whipped cream.", img: frappe, price: 160 },
    { id: 5, name: "Caffè Americano", desc: "Smooth espresso with water.", img: Americano, price: 120 },
    { id: 6, name: "Caffè Misto", desc: "Rich espresso blend with milk.", img: Misto, price: 120 },
  ];

  const product = products.find((item) => item.id === parseInt(id));
  if (!product) return <p className="text-center mt-10 text-black">Product not found</p>;

  const flavors = ["Chocolate", "Almond", "Vanilla"];
  const sizes = ["S", "M", "L"];
  const sizeMap = { S: "Small", M: "Medium", L: "Large" };
  const sizePrices = { S: 0, M: 20, L: 40 };
  const computedPrice = product.price + (sizePrices[selectedSize] || 0);

  const toggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      toast(`${product.name} removed from favorites`, { icon: "💔" });
    } else {
      addToFavorites(product);
      toast(`${product.name} added to favorites`, { icon: "❤️" });
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex(
      (item) =>
        item.id === product.id &&
        item.size === sizeMap[selectedSize] &&
        item.flavor === selectedFlavor
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity,
        flavor: selectedFlavor,
        size: sizeMap[selectedSize],
        price: computedPrice,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    toast.success(`${product.name} added to cart!`, {
      style: { background: "black", color: "white", fontSize: "18px" },
    });
  };

  return (
    <section className="min-h-screen bg-[#C7AD7F]">
    
      <div className="relative w-full max-w-2xl mx-auto h-[43vh] sm:h-[65vh]">
        <NavLink to="/menu" className="absolute left-4 sm:left-10 top-6 z-10">
          <ChevronLeft size={50} className="text-black" />
        </NavLink>

        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover object-top rounded-b-3xl"
        />

        <button
          onClick={toggleFavorite}
          className="absolute right-4 sm:right-10 top-6 z-10"
        >
          <Heart
            size={40}
            className={`transition-colors ${isFavorite(product.id) ? "fill-black text-black" : "text-black"}`}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="bg-white max-w-2xl mx-auto -mt-10 sm:-mt-16 rounded-t-3xl p-6 sm:p-10 relative z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-semibold text-black">{product.name}</h1>
          <span className="text-2xl sm:text-3xl text-black">₱ {computedPrice}</span>
        </div>

        <p className="text-black text-sm sm:text-base mt-3 leading-relaxed border-b pb-4">{product.desc}</p>

        {/* Flavors */}
        <h2 className="mt-5 mb-3 text-2xl sm:text-xl text-black">Flavor</h2>
        <div className="flex gap-4 flex-wrap border-b pb-5">
          {flavors.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFlavor(f)}
              className={`px-5 py-1 rounded-full border-2 text-lg sm:text-base transition-colors ${
                selectedFlavor === f ? "bg-black text-white" : "text-black border-black hover:bg-gray-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between mt-5 border-b pb-10">
          <h2 className="text-2xl sm:text-xl text-black">Quantity</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="text-black text-3xl font-bold px-6 sm:px-5 py-1 transition"
            >
              -
            </button>
            <span className="text-lg sm:text-xl font-medium text-black">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-black text-3xl font-bold px-6 sm:px-5 py-1 transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Size */}
        <h2 className="mt-5 mb-3 text-2xl sm:text-xl text-black">Size</h2>
        <div className="flex items-center gap-4">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`px-3 py-1 rounded-lg font-semibold border-2 text-2xl sm:text-base transition-colors ${
                selectedSize === s ? "bg-black text-white" : "text-black border-black hover:bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#C0A16B] text-black py-3 mt-10 text-3xl sm:text-xl font-semibold border-2 hover:opacity-90 transition"
        >
          Add to Cart
        </button>
      </div>
    </section>
  );

}
