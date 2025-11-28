import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Check, ChevronLeft } from "lucide-react";
import { supabase } from "../config/supabase";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [pickup, setPickup] = useState("Take-Out");
  const [payment, setPayment] = useState("Cash");
  const [pickupLocation, setPickupLocation] = useState("Coffee Hub Street");
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCart() {
      // Get authenticated user
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        navigate("/signup");
        return;
      }
      setUser(authData.user);

      // Fetch user's cart from Supabase
      const { data: cartData, error: cartError } = await supabase
        .from("cart")
        .select("items")
        .eq("user_id", authData.user.id)
        .single();

      if (cartError) {
        toast.error(`Failed to fetch cart: ${cartError.message}`);
        return;
      }

      setCartItems(cartData?.items || []);
    }

    fetchCart();
  }, [navigate]);

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const discount = (getTotal() * 0.05).toFixed(0);
  const total = (getTotal() * 0.95).toFixed(0);

  const handleConfirm = async () => {
    if (!user) return;

    const order = {
      user_id: user.id,
      items: cartItems,
      pickup,
      payment,
      total: total,
      status: "Pending",
      created_at: new Date().toISOString(),
    };

    // Insert order into Supabase
    const { data, error } = await supabase.from("orders").insert([order]);

    if (error) {
      console.error("Failed to save order:", error);
      toast.error("Failed to place order");
      return;
    }

    // Clear user's cart in Supabase
    const { error: clearError } = await supabase
      .from("cart")
      .update({ items: [] })
      .eq("user_id", user.id);

    if (clearError) {
      toast.error("Failed to clear cart");
    }

    setCartItems([]);
    setShowPopup(true);
    toast.success("Order confirmed!");
  };

  return (
    <div className="min-h-screen bg-[#C7AD7F] p-5">
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <NavLink to="/cart">
          <ChevronLeft size={40} className="text-black" />
        </NavLink>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black">
          Check Out
        </h1>
      </div>

      <p className="text-lg text-center mb-4">
        Please confirm and submit your order
      </p>

      {/* Pickup Section */}
      <div className="mb-4 bg-[#D9D9D9] p-2 rounded-xl">
        <label className="block pl-5">Pickup At</label>
        <input
          type="text"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          className="w-full pl-10 border-b pb-2"
        />
        <p className="block mb-1 pt-3 pl-5">Pickup</p>
        <label className="mr-4 pl-10">
          <input
            type="radio"
            value="Take-Out"
            checked={pickup === "Take-Out"}
            onChange={(e) => setPickup(e.target.value)}
            className="mr-1"
          />
          Take-Out
        </label>
        <label>
          <input
            type="radio"
            value="Dine-In"
            checked={pickup === "Dine-In"}
            onChange={(e) => setPickup(e.target.value)}
            className="mr-1"
          />
          Dine-In
        </label>
      </div>

      {/* Order Summary */}
      <div className="bg-[#D9D9D9] p-4 rounded-xl mb-4">
        <h2 className="text-3xl mb-4">Order Summary</h2>
        <div className="max-h-50 overflow-y-scroll">
          {cartItems.map((item, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <span className="font-semibold pl-4">{item.name}</span>
                <span className="pr-10">₱{item.price * item.quantity}</span>
              </div>
              {item.flavor && (
                <div className="flex justify-between pl-4 text-sm">
                  <span>Flavor: {item.flavor}</span>
                  <span className="pr-10">{item.quantity}x {item.price}</span>
                </div>
              )}
              <div className="flex justify-between pl-4 text-sm">
                <span>Size: {item.size}</span>
                <span className="pr-10">{item.sizePrice}</span>
              </div>
              <div className="flex justify-between pl-4 text-sm">
                <span>Qty: {item.quantity}</span>
                <span className="pr-10">{item.quantity * item.price}</span>
              </div>
            </div>
          ))}
        </div>
        <hr className="my-3 border" />
        <div className="flex justify-between text-lg pl-3">
          <span>Subtotal</span>
          <span className="pr-8">₱{getTotal()}</span>
        </div>
        <div className="flex justify-between text-lg pl-3">
          <span>Discount (5%)</span>
          <span className="pr-8">-{discount}</span>
        </div>
        <hr className="my-2 border-b" />
        <div className="flex justify-between text-2xl font-semibold p-2">
          <span>Total</span>
          <span>₱{total}</span>
        </div>
      </div>

      {/* Payment Selection */}
      <div className="mb-4 pl-2 text-2xl pb-4">
        <label className="block mb-1 pb-2">Payment Selection</label>
        <label className="mr-4 pl-20">
          <input
            type="radio"
            value="Cash"
            checked={payment === "Cash"}
            onChange={(e) => setPayment(e.target.value)}
            className="mr-4 w-6 h-6 accent-black"
          />
          Cash
        </label>
        <label>
          <input
            type="radio"
            value="G-cash"
            checked={payment === "G-cash"}
            onChange={(e) => setPayment(e.target.value)}
            className="mr-4 w-6 h-6 accent-black"
          />
          G-cash
        </label>
      </div>

      <button
        onClick={handleConfirm}
        className="w-full bg-[#E7524E] text-black py-3 text-2xl font-semibold rounded"
      >
        Confirm Order
      </button>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-xl p-10 w-100 text-center relative">
            <Check
              className="text-center p-1 rounded-full bg-green-500 text-white"
              size={40}
            />
            <h2 className="text-xl mt-3 mb-10">Thank you for your order!</h2>
            <div className="flex justify-between items-center mb-10 text-black">
              <p>Payment Method</p>
              <p>{payment}</p>
            </div>
            <button
              onClick={() => navigate("/product-orders")}
              className="bg-[#E7524E] text-black py-2 px-10 text-xl font-semibold rounded"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
