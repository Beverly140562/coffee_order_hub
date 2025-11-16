import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Check, CheckCircle } from "lucide-react";


export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [pickup, setPickup] = useState("Take-Out");
  const [payment, setPayment] = useState("Cash");
  const [pickupLocation, setPickupLocation] = useState("Coffee Hub Street");
   const [showPopup, setShowPopup] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const discount = (getTotal() * 0.05).toFixed(0);
const total = (getTotal() * 0.95).toFixed(0);
  

const handleConfirm = () => {
  const lastOrder = { 
    id: Date.now(), // unique id
    cartItems,
    pickup,
    payment,
    pickupLocation,
    total,
    timestamp: new Date(),
    status: "Pending",
    items: cartItems // for consistency with ProductOrder
  };

  // Save orders array in localStorage
  const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
  localStorage.setItem("orders", JSON.stringify([...existingOrders, lastOrder]));

  // Clear the cart so items disappear
  localStorage.removeItem("cart");
  setCartItems([]); 

  toast.success("Order confirmed!");
  setShowPopup(true); // show popup
};



  return (
    <div className="min-h-screen bg-[#C7AD7F] p-5">
      <button onClick={() => navigate(-1)} className="text-4xl font-semibold mb-4 pt-5">
        &lt; Check Out
      </button>

      <p className="text-lg text-center mb-4">Please confirm and submit your order</p>

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
            className="mr-1 "
          />
          Dine-In
        </label>
      </div>

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


      <div className="mb-4 pl-2 text-2xl pb-4">
        <label className="block mb-1 pb-2">Payment Selection</label>
        <label className="mr-4 pl-20 ">
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


      {showPopup && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-80 text-center">
      <CheckCircle className="text-green-500 mb-4 mx-auto" size={50} />
      <h2 className="text-2xl font-bold mb-4">Thank you for your order!</h2>
      <p className="mb-2">Payment Method</p>
      <p className="font-semibold mb-4">{payment}</p>
      <button
        onClick={() => {
          toast.success("Succesful payment!"); // toast on Continue
          navigate("/product-orders");
        }}
        className="bg-[#E7524E] text-black py-2 px-6 rounded text-lg font-semibold"
      >
        Continue
      </button>
    </div>
  </div>
)}

    </div>
  );
}
