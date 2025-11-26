import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import Navigation from "./Navigation";
import { useFavorites } from "./FavoritesContext";
import { supabase } from "../config/supabase";
import HeaderPage from "./HeaderPage";
import toast from "react-hot-toast";

export default function ProductSection() {
  const [activeTab, setActiveTab] = useState("Hot Coffee");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  useEffect(() => {
  if (location.state?.category) {
    setActiveTab(location.state.category);
  }
}, [location.state]);

  // Load user and fetch products from Supabase
  useEffect(() => {

    fetchProducts();
  }, [navigate]);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      toast.error("Failed to fetch products!");
      return;
    }

    setProducts(data || []);
  };

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
      <HeaderPage />

      {/* Tabs */}
      <div className="flex gap-2 mt-3 mb-8">
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
              <img src={item.image_url} className="w-full h-40 object-cover" />
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
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm mt-1">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Navigation />
    </section>
  );
}
