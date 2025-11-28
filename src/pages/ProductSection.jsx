import React, { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import Navigation from "./Navigation";
import { supabase } from "../config/supabase";
import HeaderPage from "./HeaderPage";
import toast from "react-hot-toast";
import LoadingPage from "./LoadingPage";

export default function ProductSection() {
  const [activeTab, setActiveTab] = useState("Hot Coffee");
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle tab from navigation
  useEffect(() => {
    if (location.state?.category) setActiveTab(location.state.category);
  }, [location.state]);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return setUser(null);

      const { data: profile } = await supabase
        .from("users")
        .select("id, role")
        .eq("id", authUser.id)
        .single();

      setUser({ ...authUser, role: profile?.role || "user" });
    };
    fetchUser();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) return toast.error("Failed to fetch products!");
      setProducts(data || []);
    };
    fetchProducts();
  }, []);

  // Fetch user favorites
  useEffect(() => {
    if (user) fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch favorites!");
    }
  };

  const toggleFavorite = async (e, product) => {
    e.stopPropagation(); 

    if (!user) return toast.error("Please log in to add favorites!");
    if (user.role !== "user")
      return toast.error("Only regular users can add favorites!");

    const existing = favorites.find(f => f.product_id === product.id);

    if (existing) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", existing.id);
      if (error) return toast.error("Failed to remove favorite!");
      setFavorites(favorites.filter(f => f.id !== existing.id));
      toast.success("Removed from favorites!");
    } else {
      const { data, error } = await supabase
        .from("favorites")
        .insert([{ user_id: user.id, product_id: product.id }])
        .select();
      if (error) return toast.error("Failed to add favorite!");
      setFavorites([...favorites, data[0]]);
      toast.success("Added to favorites!");
    }
  };

  const filteredProducts = products.filter(p => p.category === activeTab);

  if (!user) return <p className="min-h-screen flex flex-col items-center justify-center bg-[#C7AD7F] text-black text-2xl">
  <Loader2 className="w-10 h-10 animate-spin mb-4" />
  Loading...
</p>


  return (
    <section className="min-h-screen bg-[#C7AD7F] px-4 sm:px-6 py-6">
      <HeaderPage />

      {/* Tabs */}
      <div className="flex gap-2 mt-3 mb-8">
        {["Hot Coffee", "Cold Coffee", "Frappuccino"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-4 rounded-2xl text-black ${
              activeTab === tab
                ? "bg-[#8B4411]"
                : "border-3 bg-white border-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredProducts.map(item => {
          const isLiked = favorites.some(f => f.product_id === item.id);
          return (
            <div
              key={item.id}
              className="border-2 shadow-md relative overflow-hidden hover:scale-105 transition cursor-pointer"
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-40 object-cover cursor-pointer"
                onClick={() => navigate(`/product/${item.id}`)}
              />

              <button
                onClick={e => toggleFavorite(e, item)}
                className={`absolute top-3 right-3 z-10 ${
                  user.role !== "user" ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={user.role !== "user"}
              >
                <Heart
                  size={28}
                  className={isLiked ? "fill-red-700 text-red-700" : "text-black"}
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
