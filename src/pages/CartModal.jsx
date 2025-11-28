import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import Navigation from "./Navigation";
import { supabase } from "../config/supabase";
import { Loader2 } from "lucide-react";

export default function CartModal() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user and cart from Supabase
  useEffect(() => {
    async function fetchCart() {
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser?.user) {
        navigate("/signup");
        return;
      }
      setUser(authUser.user);

      // Fetch cart
      const { data: cartData, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", authUser.user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Failed to fetch cart:", error);
        return;
      }

      setCartItems(cartData?.items || []);
    }

    fetchCart();
  }, [navigate]);

  // Update quantity in Supabase
  const updateQuantity = async (index, delta) => {
  if (!user) return;

  const updatedCart = [...cartItems];
  const newQuantity = updatedCart[index].quantity + delta;

  if (newQuantity < 1) {
    updatedCart.splice(index, 1);
  } else {
    updatedCart[index].quantity = newQuantity;
  }

  setCartItems(updatedCart);

  const { error } = await supabase
    .from("cart")
    .upsert({ user_id: user.id, items: updatedCart });

  if (error) console.error("Failed to update cart:", error);
};

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!user) return <p className="min-h-screen flex flex-col items-center justify-center bg-[#C7AD7F] text-black text-2xl">
  <Loader2 className="w-10 h-10 animate-spin mb-4" />
  Loading...
</p>
;
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#C7AD7F] text-black">
        <h2 className="text-3xl mb-4">Your cart is empty</h2>
        <NavLink to="/menu" className="text-xl underline">
          Go to Menu
        </NavLink>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#C7AD7F] relative pb-40">
      <h1 className="text-4xl mb-8 font-semibold text-black pl-5 pt-10">Cart</h1>
      <p className="text-3xl pb-2 font-semibold pl-5">Order Items</p>

      <div className="space-y-1 max-h-[50vh] overflow-y-auto px-1">
        {cartItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-4">
            <div className="flex items-center gap-4">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-30 h-32 object-cover"
              />
              <div className="flex flex-col justify-between w-full">
                <div className="flex justify-between w-full">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <span className="text-2xl">₱ {item.price}</span>
                </div>

                <p className="pt-2 text-lg">Flavor: {item.flavor || "None"}</p>
                <p className="text-lg">Size: {item.size}</p>

                <div className="flex items-center gap-7 mt-2">
                  <button
                    onClick={() => updateQuantity(index, -1)}
                    className="text-black text-xl font-bold px-3 py-1"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, 1)}
                    className="text-black text-xl font-bold px-3 py-1"
                  >
                    +
                  </button>
                  <span className="ml-4 text-2xl">₱ {item.price * item.quantity}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-20 left-0 w-full px-5 bg-[#C7AD7F] pb-4">
        <div className="flex justify-end gap-2 items-center mb-4">
          <h2 className="text-3xl">Total:</h2>
          <span className="text-3xl">₱ {getTotal()}</span>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-[#E7524E] text-black w-full py-3 text-3xl font-semibold transition"
        >
          Checkout
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full">
        <Navigation />
      </div>
    </section>
  );
}
