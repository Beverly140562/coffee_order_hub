import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import Navigation from "./Navigation";
import { supabase } from "../config/supabase";
import { Loader2 } from "lucide-react";
import ProductOrder from "./ProductOrder";

export default function CartModal() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [guestId, setGuestId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCart() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        let userId;

        if (authUser) {
          setUser(authUser);
          userId = authUser.id;
        } else {
          let storedGuestId = localStorage.getItem("guest_id");
          if (!storedGuestId) {
            storedGuestId = crypto.randomUUID();
            localStorage.setItem("guest_id", storedGuestId);

            const guestEmail = `guest_${storedGuestId}@guest.com`;
            const guestPassword = crypto.randomUUID();

            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: guestEmail,
              password: guestPassword,
            });
            if (signUpError) throw signUpError;

            const { error: insertError } = await supabase.from("users").insert([{
              id: signUpData.user.id,
              last_name: "Guest",
              role: "guest",
              email: guestEmail,
            }]);
            if (insertError) throw insertError;

            await supabase.auth.signInWithPassword({
              email: guestEmail,
              password: guestPassword,
            });

            storedGuestId = signUpData.user.id;
          }
          setGuestId(storedGuestId);
          userId = storedGuestId;
        }

        const { data: cartData, error } = await supabase
          .from("cart")
          .select(`
            *,
            menu:product_id (name, price, image_url)
          `)
          .eq("user_id", userId);

        if (error) console.error("Failed to fetch cart:", error);
        setCartItems(cartData || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCart();
  }, []);

  const updateQuantity = async (index, delta) => {
    const updatedCart = [...cartItems];
    const item = updatedCart[index];
    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) {
      const { error } = await supabase
        .from("cart")
        .delete()
        .match({
          user_id: item.user_id,
          product_id: item.product_id,
          size: item.size,
          flavor: item.flavor
        });
      if (error) return console.error("Failed to delete cart item:", error);

      updatedCart.splice(index, 1);
    } else {
      const { error } = await supabase
        .from("cart")
        .update({ quantity: newQuantity })
        .match({
          user_id: item.user_id,
          product_id: item.product_id,
          size: item.size,
          flavor: item.flavor
        });
      if (error) console.error("Failed to update cart item:", error);

      updatedCart[index].quantity = newQuantity;
    }

    setCartItems(updatedCart);
  };

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.menu.price * item.quantity, 0);

  if (!user && !guestId)
    return (
      <p className="min-h-screen flex flex-col items-center justify-center bg-[#C7AD7F] text-black text-2xl">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        Loading...
      </p>
    );

  if (cartItems.length === 0) {
    return (
        <ProductOrder />
    );
  }

  return (
    <section className="min-h-screen bg-[#C7AD7F] relative pb-40">
      <h1 className="text-4xl mb-8 font-semibold text-black pl-5 pt-10">Cart</h1>
      <p className="text-3xl pb-2 font-semibold pl-5">Order Items</p>

      <div className="space-y-1 max-h-[50vh] overflow-y-auto px-1">
        {cartItems.map((item, index) => (
          <div
            key={`${item.product_id}-${item.size}-${item.flavor}-${index}`}
            className="flex justify-between items-center p-4"
          >
            <div className="flex items-center gap-4">
              <img src={item.menu.image_url} alt={item.menu.name} className="w-30 h-32 object-cover" />
              <div className="flex flex-col justify-between w-full">
                <div className="flex justify-between w-full">
                  <h2 className="text-xl font-semibold">{item.menu.name}</h2>
                  <span className="text-2xl">₱ {item.menu.price}</span>
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
                  <span className="ml-4 text-2xl">₱ {item.menu.price * item.quantity}</span>
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

      <div className="fixed bottom-0 left-0 w-full">
        <Navigation />
      </div>
    </section>
  );
}
