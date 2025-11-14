import React, { useState } from "react";
import { Heart, MoreVertical } from "lucide-react";
import { useFavorites } from "./FavoritesContext";
import Navigation from "./Navigation";

function FavoritesPage() {
  const { favorites, removeFromFavorites } = useFavorites();
  const [popupId, setPopupId] = useState(null); 

  const handleRemove = (id) => {
    removeFromFavorites(id);
    setPopupId(null); 
  };

  return (
    <section className="min-h-screen bg-[#C7AD7F] px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="w-fullflex items-center justify-start mb-10">
        <h1 className="text-4xl font-bold text-black flex-1">Favorites</h1>
      </div>

      {favorites.length === 0 ? (
        <p className="text-black text-lg text-center">
          No favorites yet ☕ — add some from the menu!
        </p>
      ) : (
        <div className="flex flex-col items-center gap-5">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white shadow w-full max-w-md rounded-lg relative"
            >
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 px-4">
                <p className="text-lg font-medium text-black">{item.name}</p>
              </div>

              <div className="flex items-center space-x-3 relative">
                <Heart
                  size={35}
                  className="text-red-700 fill-red-700 cursor-pointer hover:scale-110 transition-transform"
                  
                />
                <MoreVertical
                  size={24}
                  className="text-gray-600 cursor-pointer hover:text-black transition-colors"
                  onClick={() =>
                    setPopupId(popupId === item.id ? null : item.id)
                  }
                />

                {popupId === item.id && (
                  <div className="absolute top-0 right-8 bg-white rounded shadow-md p-3 flex flex-col text-center gap-2 w-48">
  <p className="text-sm mb-3 font-medium text-black">
    Remove from Favorites ? <span className="">{item.name}</span>
  </p>
  <div className="flex-col gap-2">
    <button
      onClick={() => handleRemove(item.id)}
      className="bg-red-400 text-black px-7 py-2 rounded-4xl hover:bg-red-600 transition text-lg font-medium"
    >
      Remove
    </button> <br />
    <button
      onClick={() => setPopupId(null)}
      className=" text-black px-4 py-2 rounded-2xl text-lg font-medium"
    >
      Cancel
    </button>
  </div>
</div>

                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Nav */}
      <div className="mt-10 sm:mt-12">
        <Navigation />
      </div>
    </section>
  );
}

export default FavoritesPage;
