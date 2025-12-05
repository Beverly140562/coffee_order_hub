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
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        let userId = authUser?.id;

        if (!userId) {
          const guestId = localStorage.getItem("guest_id");
          if (!guestId) {
            toast.error("Please login to continue checkout");
            navigate("/signup");
            return;
          }
          userId = guestId;
        }
        setUser({ id: userId });

        const { data: cartData, error: cartError } = await supabase
          .from("cart")
          .select("*, product:products(*)") 
          .eq("user_id", userId);

        if (cartError) throw cartError;

        const sizePrices = { S: 0, M: 20, L: 40 };
        const itemsWithPrice = cartData.map((item) => ({
          ...item,
          price: item.product.price + (sizePrices[item.size] || 0),
        }));

        setCartItems(itemsWithPrice);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load cart");
      }
    }

    fetchCart();
  }, [navigate]);

  const getTotal = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = (getTotal()).toFixed(0);

  const handleConfirm = async () => {
    if (!user) return;

    try {
      const order = {
        user_id: user.id,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          name: item.product.name,
          size: item.size,
          flavor: item.flavor,
          quantity: item.quantity,
          price: item.price,
        })),
        pickup,
        payment,
        total,
        status: "Pending",
        created_at: new Date().toISOString(),
      };

      const { error: orderError } = await supabase.from("orders").insert([order]);
      if (orderError) throw orderError;

      const { error: clearError } = await supabase.from("cart").delete().eq("user_id", user.id);
      if (clearError) throw clearError;

      setCartItems([]);
      setShowPopup(true);
      toast.success("Order confirmed!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-[#C7AD7F] p-5">
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <NavLink to="/cart">
          <ChevronLeft size={40} className="text-black" />
        </NavLink>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black">Check Out</h1>
      </div>

      <p className="text-lg text-center mb-4">Please confirm and submit your order</p>

      <div className="mb-4 bg-[#D9D9D9] p-2 rounded-xl">
        <label className="block pl-5">Pickup Location</label>
        <input
          type="text"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          className="w-full pl-10 border-b pb-2"
        />
        <p className="block mb-1 pt-3 pl-5">Pickup Type</p>
        <label className="mr-4 pl-10">
          <input type="radio" value="Take-Out" checked={pickup === "Take-Out"} onChange={(e) => setPickup(e.target.value)} className="mr-1" />
          Take-Out
        </label>
        <label>
          <input type="radio" value="Dine-In" checked={pickup === "Dine-In"} onChange={(e) => setPickup(e.target.value)} className="mr-1" />
          Dine-In
        </label>
      </div>

      <div className="bg-[#D9D9D9] p-4 rounded-xl mb-4">
        <h2 className="text-3xl mb-4">Order Summary</h2>
        <div className="max-h-50 overflow-y-scroll">
          {cartItems.map((item, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between">
                <span className="font-semibold pl-4">{item.product.name}</span>
                <span className="pr-10">₱{item.price * item.quantity}</span>
              </div>
              <div className="flex justify-between pl-4 text-sm">
                <span>Size: {item.size}</span>
                <span className="pr-10">{item.price}</span>
              </div>
              {item.flavor && (
                <div className="flex justify-between pl-4 text-sm">
                  <span>Flavor: {item.flavor}</span>
                  <span className="pr-10">{item.quantity}x {item.price}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <hr className="my-3 border" />
        <div className="flex justify-between text-lg pl-3">
          <span>Subtotal</span>
          <span className="pr-8">₱{getTotal()}</span>
        </div>
        <hr className="my-2 border-b" />
        <div className="flex justify-between text-2xl font-semibold p-2">
          <span>Total</span>
          <span>₱{total}</span>
        </div>
      </div>

      <div className="mb-4 pl-2 text-2xl pb-4">
        <label className="block mb-1 pb-2">Payment Method</label>
        <label className="mr-4 pl-20">
          <input type="radio" value="Cash" checked={payment === "Cash"} onChange={(e) => setPayment(e.target.value)} className="mr-4 w-6 h-6 accent-black" />
          Cash
        </label>
        <label>
          <input type="radio" value="G-cash" checked={payment === "G-cash"} onChange={(e) => setPayment(e.target.value)} className="mr-4 w-6 h-6 accent-black" />
          G-cash
        </label>
      </div>

      <button onClick={handleConfirm} className="w-full bg-[#E7524E] text-black py-3 text-2xl font-semibold rounded">
        Confirm Order
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-xl p-10 w-100 text-center relative">
            <Check className="text-center p-1 rounded-full bg-green-500 text-white" size={40} />
            <h2 className="text-xl mt-3 mb-10">Thank you for your order!</h2>
            <div className="flex justify-between items-center mb-10 text-black">
              <p>Payment Method</p>
              <p>{payment}</p>
            </div>
            <button onClick={() => navigate("/product-orders")} className="bg-[#E7524E] text-black py-2 px-10 text-xl font-semibold rounded">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
