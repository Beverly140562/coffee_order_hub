import React, { useState, useEffect } from "react";
import { ChevronLeft, Heart, Loader2 } from "lucide-react";
import { NavLink, useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { supabase } from "../config/supabase";

export default function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("S");
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const flavors = ["Chocolate", "Almond", "Vanilla"];
  const sizes = ["S", "M", "L"];
  const sizePrices = { S: 0, M: 20, L: 40 };

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser || null);

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (productError || !productData) {
          toast.error("Product not found");
          return;
        }

        setProduct({
          ...productData,
          isOutOfStock: productData.stock_status === "Out of Stock",
        });

        if (authUser) {
          const { data: favs } = await supabase
            .from("favorites")
            .select("*")
            .eq("user_id", authUser.id);
          setFavorites(favs || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [id]);

  if (!product)
    return (
      <p className="min-h-screen bg-[#C7AD7F] flex flex-col items-center justify-center pt-20 text-black text-3xl">
        <Loader2 className="w-10 h-10 animate-spin text-black mb-5" />
        Loading
      </p>
    );

  const computedPrice = product.price + (sizePrices[selectedSize] || 0);
  const isFavorite = (productId) =>
    favorites.some((f) => f.product_id === productId);

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Please login to use favorites");
      navigate("/signup");
      return;
    }

    const existing = favorites.find((f) => f.product_id === product.id);

    if (existing) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", existing.id);
      if (error) return toast.error("Failed to remove favorite");

      setFavorites(favorites.filter((f) => f.id !== existing.id));
      toast(`${product.name} removed from favorites`);
    } else {
      const { data: newFav, error } = await supabase
        .from("favorites")
        .insert([{ user_id: user.id, product_id: product.id }])
        .select();
      if (error) return toast.error("Failed to add favorite");

      setFavorites([...favorites, newFav[0]]);
      toast(`${product.name} added to favorites ❤️`);
    }
  };

  const handleAddToCart = async () => {
    if (product.isOutOfStock) {
      toast.error(`${product.name} is out of stock!`);
      return;
    }

    try {
      let userId = user?.id;

      if (!userId) {
        let guestId = localStorage.getItem("guest_id");

        if (!guestId) {
          guestId = crypto.randomUUID();
          localStorage.setItem("guest_id", guestId);

          const guestEmail = `guest_${guestId}@guest.com`;
          const guestPassword = crypto.randomUUID();

          const { data: signUpData, error: signUpError } =
            await supabase.auth.signUp({
              email: guestEmail,
              password: guestPassword,
            });
          if (signUpError) throw signUpError;

          await supabase.from("users").insert([
            {
              id: signUpData.user.id,
              last_name: "Guest",
              role: "guest",
              email: guestEmail,
            },
          ]);

          const { error: loginError } = await supabase.auth.signInWithPassword({
            email: guestEmail,
            password: guestPassword,
          });
          if (loginError) throw loginError;

          guestId = signUpData.user.id;
        }

        userId = guestId;
        setUser({ id: guestId });
      }

      // ---- FIXED (Removed duplicated block) ----
      const { data: menuData, error: menuError } = await supabase
        .from("menu")
        .select("product_id")
        .eq("product_id", product.id)
        .maybeSingle();

      if (!menuData) return toast.error("Product not available in menu");

      const finalFlavor = selectedFlavor || "None";

      const { data: existingCart } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", product.id)
        .eq("size", selectedSize)
        .eq("flavor", finalFlavor)
        .maybeSingle();

      if (existingCart) {
        const { error: updateError } = await supabase
          .from("cart")
          .update({ quantity: existingCart.quantity + quantity })
          .eq("id", existingCart.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("cart").insert([
          {
            user_id: userId,
            product_id: product.id,
            quantity,
            size: selectedSize,
            flavor: finalFlavor,
          },
        ]);
        if (insertError) throw insertError;
      }

      toast.success(`${product.name} added to cart!`);
      navigate("/menu", { state: { category: product.category } });
    } catch (err) {
      console.error("Cart insert error:", err);
      toast.error("Failed to add to cart");
    }
  };

  return (
    // --- UI remains EXACT SAME ---
    <section className="min-h-screen bg-[#C7AD7F]">
      <div className="relative w-full max-w-2xl mx-auto h-[43vh] sm:h-[65vh]">
        <NavLink
          to="/menu"
          state={{ category: product.category }}
          className="absolute left-4 sm:left-10 top-6 z-10"
        >
          <ChevronLeft size={50} className="text-black" />
        </NavLink>

        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-top rounded-b-3xl cursor-pointer"
        />

        <button
          onClick={toggleFavorite}
          className="absolute right-4 sm:right-10 top-6 z-10"
        >
          <Heart
            size={40}
            className={`transition-colors ${
              isFavorite(product.id)
                ? "fill-red-700 text-red-700"
                : "text-black"
            }`}
          />
        </button>
      </div>

      <div className="bg-white max-w-2xl mx-auto -mt-10 sm:-mt-16 rounded-t-3xl p-6 sm:p-10 relative z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-semibold text-black">
            {product.name}
          </h1>
          <span className="text-3xl sm:text-3xl text-black">
            ₱ {computedPrice}
          </span>
        </div>

        <p className="text-black text-sm sm:text-base mt-3 leading-relaxed border-b pb-4">
          {product.description}
        </p>

        <h2 className="mt-3 pl-3 mb-3 text-2xl sm:text-xl text-black">Flavor</h2>
        <div className="flex gap-4 flex-wrap border-b pb-5 pl-8">
          {flavors.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFlavor(f)}
              className={`px-6 py-1 rounded-full border-2 text-sm sm:text-base transition-colors ${
                selectedFlavor === f
                  ? "bg-black text-white"
                  : "text-black border-black hover:bg-gray-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-5 border-b pb-10">
          <h2 className="text-2xl sm:text-xl pl-3 text-black">Quantity</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="text-black text-2xl font-bold px-6 sm:px-5 py-1 transition"
            >
              -
            </button>
            <span className="text-lg sm:text-xl font-medium text-black">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-black text-2xl font-bold px-6 sm:px-5 py-1 transition"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pb-10">
          <h2 className="text-2xl sm:text-xl pl-3 text-black">Size</h2>
          <div className="flex items-center gap-4 pr-13">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-3 py-1 rounded-lg font-semibold border-2 text-2xl sm:text-base transition-colors ${
                  selectedSize === s
                    ? "bg-black text-white"
                    : "text-black border-black hover:bg-gray-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={product.isOutOfStock ? null : handleAddToCart}
          disabled={product.isOutOfStock}
          className={`w-full sm:w-80 py-2 mt-4 sm:mt-1 mb-10 text-3xl sm:text-xl font-semibold border-2 block mx-auto
            ${
              product.isOutOfStock
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#C0A16B] text-black hover:opacity-90"
            }`}
        >
          {product.isOutOfStock ? "Out of Stock" : "Add Cart"}
        </button>
      </div>
    </section>
  );
}
