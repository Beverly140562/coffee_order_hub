import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { NavLink, useNavigate } from "react-router";

export default function CheckOut() {
  const [cart, setCart] = useState([]);
  const [method, setMethod] = useState("Take-Out");
  const [payment, setPayment] = useState("Cash");
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser?.email) {
      setUserEmail(savedUser.email);
      const savedCart = JSON.parse(localStorage.getItem(`cart_${savedUser.email}`)) || [];
      setCart(savedCart);
    } else {
      navigate("/signup"); 
    }
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * 0.05; 
  const total = subtotal - discount;

  const handleConfirm = () => setShowModal(true);

  const handleClose = () => {
    const savedOrders = JSON.parse(localStorage.getItem(`orders_${userEmail}`)) || [];

    const newOrder = {
      id: Date.now(),
      items: cart,
      total,
      payment,
      method,
      status: "Pending",
      timestamp: new Date().toISOString(),
    };

    savedOrders.push(newOrder);
    localStorage.setItem(`orders_${userEmail}`, JSON.stringify(savedOrders));

    localStorage.removeItem(`cart_${userEmail}`);
    setCart([]);
    setShowModal(false);

    navigate("/menu"); 
  };

  return (
    <section className="min-h-screen bg-[#C7AD7F] px-4 sm:px-6 md:px-10 py-6 scrollbar-none">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <NavLink to="/cart">
          <ChevronLeft size={40} className="text-black" />
        </NavLink>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black">Check Out</h1>
      </div>

      <h2 className="text-sm sm:text-base text-black mb-5 text-center">
        Please confirm and submit your order
      </h2>

      <div className="bg-[#D9D9D9] p-3 sm:p-5 rounded-xl shadow mb-5 max-w-md mx-auto">
        <h2 className="text-lg sm:text-xl text-black pl-1 sm:pl-3">Pickup At</h2>
        <p className="text-black pl-5 sm:pl-5 mb-2">Coffee Hub Street</p>
        <hr className="border-black mb-3" />

        <h2 className="text-xl sm:text-xl text-black mb-2 pl-1 sm:pl-3">Pickup Method</h2>
        <div className="flex flex-wrap gap-10 pl-5 sm:pl-10">
          {["Take-Out", "Dine-in"].map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className="flex items-center gap-3 text-base sm:text-xl font-medium"
            >
              <span
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-black flex-shrink-0 ${
                  method === m ? "bg-black" : "bg-[#D9D9D9]"
                }`}
              ></span>
              <span className="text-black">{m}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#D9D9D9] rounded-xl shadow mb-5 max-w-md mx-auto ">
        <h2 className="text-3xl sm:text-3xl text-black mb-2 border-b p-4 sm:p-5">
          Order Summary
        </h2>

        <div className="max-h-60 sm:max-h-96 overflow-y-auto px-2 sm:px-4 py-2 scrollbar-none">
          {cart.map((item, index) => (
            <div key={index} className="p-2 sm:p-4 border-b border-gray-300">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-base sm:text-lg font-semibold text-black">{item.name}</h3>
                <p className="text-black font-semibold">₱{item.price * item.quantity}</p>
              </div>

              <div className="flex justify-between items-center mb-1">
                {item.flavor ? (
                  <p className="text-black text-sm sm:text-base">Flavor: {item.flavor}</p>
                ) : (
                  <p className="text-black text-sm sm:text-base invisible">No Flavor</p>
                )}
                <p className="text-black text-sm sm:text-base">
                  {item.quantity} × ₱{item.price}
                </p>
              </div>

              <div className="flex justify-between items-center mb-1">
                <p className="text-black text-sm sm:text-base">Size: {item.size}</p>
                <p className="text-black text-sm sm:text-base">₱{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 pb-5 px-2 sm:px-4 border-t">
          <div className="flex justify-between text-black text-base sm:text-lg mb-1">
            <span>Subtotal</span>
            <span>₱ {subtotal}</span>
          </div>
          <div className="flex justify-between text-black text-base sm:text-lg mb-1">
            <span>Discount (5%)</span>
            <span>-₱ {discount.toFixed(0)}</span>
          </div>
          <div className="border-t mt-2 pt-2">
            <div className="flex justify-between font-bold text-lg sm:text-xl text-black">
              <span>Total</span>
              <span>₱ {total.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Selection */}
      <div className="max-w-md mx-auto mb-5 px-2 sm:px-4">
        <h2 className="text-xl sm:text-xl font-semibold text-black mb-2">Payment Selection</h2>
        <div className="flex flex-wrap gap-10 pl-10">
          {["Cash", "G-cash"].map((p) => (
            <button
              key={p}
              onClick={() => setPayment(p)}
              className="flex items-center gap-5 text-2xl"
            >
              <span
                className={`w-7 h-7 sm:w-5 sm:h-5 rounded-full border-2 transition-colors ${
                  payment === p ? "bg-black border-black" : " bg-[#C7AD7F]"
                }`}
              ></span>
              <span className="text-black">{p}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <button
          onClick={handleConfirm}
          className="w-full bg-[#E7524E] text-black py-3 sm:py-4 text-3xl sm:text-2xl font-semibold"
        >
          Confirm Order
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h2 className="text-3xl font-bold text-center text-black mb-4">
              Thank you! for your order
            </h2>

            <div className="mb-4">
              <p className="text-lg text-black font-semibold mb-2">Payment Method</p>

              <div className="flex items-center gap-3 px-3 py-2">
                <span className="w-5 h-5 rounded-full border-2 bg-black border-black flex-shrink-0"></span>
                <span className="text-black text-lg font-medium">{payment}</span>
              </div>
            </div>

            <button
              className="w-full bg-[#E7524E] text-black py-3 text-xl font-semibold rounded-lg"
              onClick={handleClose}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
