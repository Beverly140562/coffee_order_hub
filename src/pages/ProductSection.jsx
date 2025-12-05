import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import Navigation from "./Navigation";
import { supabase } from "../config/supabase";
import HeaderPage from "./HeaderPage";
import toast from "react-hot-toast";

export default function ProductSection() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCategory = location.state?.category || null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: menus, error: menuError } = await supabase
          .from("menu")
          .select("product_id");
        if (menuError) throw menuError;

        const productIds = menus.map(m => m.product_id);

        const { data: productsData, error: prodError } = await supabase
          .from("products")
          .select("*")
          .in("id", productIds);
        if (prodError) throw prodError;

        setProducts(productsData);

        const uniqueCategories = [...new Set(productsData.map(p => p.category))];
        setCategories(uniqueCategories);

        setActiveTab(selectedCategory || uniqueCategories[0] || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products!");
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return setUser(null);

      const { data: profile } = await supabase
        .from("users")
        .select("id, role")
        .eq("id", authUser.id)
        .maybeSingle();

      setUser({ ...authUser, role: profile?.role || "user" });

      const { data: favs, error: favError } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", authUser.id);
      if (!favError) setFavorites(favs || []);
    };
    fetchUser();
  }, []);

  const toggleFavorite = async (e, product) => {
    e.stopPropagation();
    if (!user) return toast.error("Guests cannot add favorites!");
    if (user.role !== "user") return toast.error("Only regular users can add favorites!");

    const existing = favorites.find(f => f.product_id === product.id);

    if (existing) {
      const { error } = await supabase.from("favorites").delete().eq("id", existing.id);
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

  return (
    <section className="min-h-screen bg-[#C7AD7F] px-4 sm:px-6 py-6">
      <HeaderPage />

      <div className="flex gap-2 mt-3 mb-8 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-3 rounded-2xl text-black whitespace-nowrap ${
              activeTab === cat
                ? "bg-[#8B4411] text-white"
                : "border-2 bg-white border-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredProducts.map(item => {
          const isLiked = favorites.some(f => f.product_id === item.id);
          return (
            <div
              key={item.id}
              className="border-2 shadow-md relative overflow-hidden hover:scale-105 transition cursor-pointer"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-40 object-cover"
              />

              <button
                onClick={e => toggleFavorite(e, item)}
                className={`absolute top-3 right-3 z-10 ${
                  !user || user.role !== "user" ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!user || user.role !== "user"}
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

        {filteredProducts.length === 0 && (
          <p className="text-center text-black text-xl col-span-full">
            No products found in this category.
          </p>
        )}
      </div>

      <Navigation />
    </section>
  );
}
