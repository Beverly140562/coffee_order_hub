import React, { useState, useEffect } from "react";
import { Heart, MoreVertical } from "lucide-react";
import { useFavorites } from "./FavoritesContext";
import Navigation from "./Navigation";
import { useNavigate } from "react-router";

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favItems, setFavItems] = useState([]);

  useEffect(() => {
    const savedFavorites = favorites.map((item) => ({
      ...item,
      img: item.img || item.image_url, 
      description: item.description || item.desc || "", 
    }));
    setFavItems(savedFavorites);
  }, [favorites]);

  const openRemoveModal = (e, item) => {
    e.stopPropagation(); 
    setSelectedItem(item);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  return (
    <section className="min-h-screen bg-[#C7AD7F] px-4 sm:px-6 py-10">
      <h1 className="text-4xl font-bold text-black mb-8">Favorites</h1>

      {favItems.length === 0 ? (
        <p className="text-center text-black text-lg">
          No favorites yet ☕ — add some from the menu!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {favItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center w-full bg-white shadow-md overflow-hidden hover:scale-105 transition cursor-pointer"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <div className="w-20 h-20 bg-[#0F3A2E] flex items-center justify-center">
                <img
                  src={item.img || "/placeholder.png"}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromFavorites(item.id);
                  }}
                >
                  <Heart size={40} className="fill-red-700 text-red-700" />
                </button>

                <button onClick={(e) => openRemoveModal(e, item)}>
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
                  removeFromFavorites(selectedItem.id);
                  closeModal();
                }}
              >
                Remove
              </button>

              <button
                className=" py-2 rounded-lg font-semibold"
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
