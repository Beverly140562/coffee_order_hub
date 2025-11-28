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
  const sizeMap = { S: "Small", M: "Medium", L: "Large" };
  const sizePrices = { S: 0, M: 20, L: 40 };

  // Fetch user and product
  useEffect(() => {
    async function fetchData() {
      //  Check user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        navigate("/signup");
        return;
      }
      setUser(authUser);

      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (productError || !productData) {
        toast.error("Product not found");
        return;
      }
      setProduct(productData);

      //  Fetch favorites
      const { data: favs, error: favError } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", authUser.id);

      if (favError) {
        toast.error("Failed to fetch favorites");
        return;
      }
      setFavorites(favs || []);
    }

    fetchData();
  }, [id, navigate]);

  if (!product)
    return (
      <p className="min-h-screen bg-[#C7AD7F] flex flex-col items-center justify-center pt-20 text-black text-3xl">
        <Loader2 className="w-10 h-10 animate-spin text-black mb-5" />
        Loading
      </p>
    );

  const computedPrice = product.price + (sizePrices[selectedSize] || 0);

  const isFavorite = (productId) => {
    return favorites.some((f) => f.product_id === productId);
  };

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
    if (!user) {
      navigate("/signup");
      return;
    }

    const { data: existingCart, error: fetchError } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user.id);

    if (fetchError) return toast.error("Failed to fetch cart");

    let cart = existingCart?.[0]?.items || [];

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
        id: product.id,
        name: product.name,
        quantity,
        flavor: selectedFlavor,
        size: sizeMap[selectedSize],
        price: computedPrice,
        image_url: product.image_url,
      });
    }

    if (existingCart?.length > 0) {
      const { error } = await supabase
        .from("cart")
        .update({ items: cart })
        .eq("user_id", user.id);
      if (error) return toast.error("Failed to update cart");
    } else {
      const { error } = await supabase
        .from("cart")
        .insert({ user_id: user.id, items: cart });
      if (error) return toast.error("Failed to add to cart");
    }

    toast.success(`${product.name} added to cart!`);
  };

  return (
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
              isFavorite(product.id) ? "fill-red-700 text-red-700" : "text-black"
            }`}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="bg-white max-w-2xl mx-auto -mt-10 sm:-mt-16 rounded-t-3xl p-6 sm:p-10 relative z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-semibold text-black">{product.name}</h1>
          <span className="text-3xl sm:text-3xl text-black">₱ {computedPrice}</span>
        </div>

        <p className="text-black text-sm sm:text-base mt-3 leading-relaxed border-b pb-4">
          {product.description}
        </p>

        {/* Flavors */}
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

        {/* Quantity */}
        <div className="flex items-center justify-between mt-5 border-b pb-10">
          <h2 className="text-2xl sm:text-xl pl-3 text-black">Quantity</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="text-black text-2xl font-bold px-6 sm:px-5 py-1 transition"
            >
              -
            </button>
            <span className="text-lg sm:text-xl font-medium text-black">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-black text-2xl font-bold px-6 sm:px-5 py-1 transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Size */}
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

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full sm:w-80 bg-[#C0A16B] text-black py-2 mt-4 sm:mt-1 mb-10 text-3xl sm:text-xl font-semibold border-2 hover:opacity-90 transition block mx-auto"
        >
          Add Cart
        </button>
      </div>
    </section>
  );
}
