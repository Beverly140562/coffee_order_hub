import React, { useEffect, useState } from "react";
import { Heart, Loader2, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../config/supabase";
import Navigation from "./Navigation";
import toast from "react-hot-toast";

export default function FavoritesPage({ user: propUser }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(propUser || null);
  const [favItems, setFavItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const LOCAL_FAV_KEY = "guest_favorites";

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        if (error || !authUser) {
          setUser(null);
          return;
        }

        const { data: profile } = await supabase
          .from("users")
          .select("id, role")
          .eq("id", authUser.id)
          .single();

        setUser({ ...authUser, role: profile?.role || "user" });
      }
    };

    fetchUser();
  }, [user]);

  
useEffect(() => {
  if (!user) {
    setFavItems(getLocalFavorites());
  } else {
    fetchFavorites();
  }
}, [user]);


  const getLocalFavorites = () => {
  const stored = localStorage.getItem(LOCAL_FAV_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLocalFavorites = (items) => {
  localStorage.setItem(LOCAL_FAV_KEY, JSON.stringify(items));
};

  const fetchFavorites = async () => {
    try {
      const { data: favs, error } = await supabase
        .from("favorites")
        .select(`
          id,
          product_id,
          product:product_id (
            id,
            name,
            image_url,
            description,
            detail
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const mappedFavorites = favs
        .filter(f => f.product)
        .map(f => ({
          favoriteId: f.id,
          id: f.product.id,
          name: f.product.name,
          img: f.product.image_url || "/placeholder.png",
          description: f.product.description ||"",
        }));

      setFavItems(mappedFavorites);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      toast.error("Failed to load favorites!");
    }
  };

  const removeFavorite = async (favoriteId) => {
  if (!user) {
    const updated = favItems.filter(item => item.favoriteId !== favoriteId);
    setFavItems(updated);
    saveLocalFavorites(updated);
    toast.success("Removed from favorites!");
    return;
  }

  try {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", favoriteId);

    if (error) throw error;

    setFavItems(favItems.filter(item => item.favoriteId !== favoriteId));
    toast.success("Removed from favorites!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to remove favorite!");
  }
};


  const openRemoveModal = (e, item) => {
    e.stopPropagation();
    setSelectedItem(item);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

if (user === undefined) {
  return (
    <p className="min-h-screen flex items-center justify-center text-2xl">
      Loading...
    </p>
  );
}

  return (
    <section className="min-h-screen bg-[#C7AD7F] px-4 sm:px-6 py-10">
      <h1 className="text-4xl font-bold text-black mb-8">Favorites</h1>

      {favItems.length === 0 ? (
        <p className="text-center text-black text-lg">
          No favorites yet ☕ — add some from the menu!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {favItems.map(item => (
            <div
              key={item.favoriteId}
              className="flex items-center w-full bg-white shadow-md overflow-hidden hover:scale-105 transition cursor-pointer"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <div className="w-20 h-20 bg-[#0F3A2E] flex items-center justify-center">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-14 h-14 object-contain"
                />
              </div>

              <div className="flex-1 px-4">
                <h3 className="text-black font-semibold text-2xl leading-tight">
                  {item.name}
                </h3>
              </div>

              <div className="flex items-center gap-3 pr-3">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    removeFavorite(item.favoriteId);
                  }}
                >
                  <Heart size={40} className="fill-red-700 text-red-700" />
                </button>

                <button onClick={e => openRemoveModal(e, item)}>
                  <MoreVertical size={30} className="text-black" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {openModal && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl text-center p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl mb-2">Remove from Favorite?</h2>
            <p className="text-black text-xl mb-6">{selectedItem.name}</p>

            <div className="flex flex-col gap-3">
              <button
                className="bg-[#E7524E] text-black py-2 rounded-lg font-semibold"
                onClick={() => {
                  removeFavorite(selectedItem.favoriteId);
                  closeModal();
                }}
              >
                Remove
              </button>

              <button
                className="py-2 rounded-lg font-semibold"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </section>
  );
}
