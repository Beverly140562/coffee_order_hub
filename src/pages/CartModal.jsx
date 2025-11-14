import { ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import Navigation from "./Navigation";
import { NavLink } from "react-router";

function CartModal() {
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const increment = (id) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const decrement = (id) => {
  setCartItems((prev) => {
    const updated = prev
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0); 

    localStorage.setItem("cart", JSON.stringify(updated));
    return updated;
  });
};


  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <section className="min-h-screen bg-[#C7AD7F] px-4 sm:px-6 pt-10 relative">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button className="p-2 rounded-full hover:bg-gray-200 transition">
          <ChevronLeft size={40} className="text-black" />
        </button>
        <h1 className="ml-4 text-4xl sm:text-5xl font-bold text-black">Cart</h1>
      </div>

      {/* Cart Items */}
      <div className="max-w-md mx-auto p-2 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
        <h2 className="text-3xl font-semibold text-black mb-4">Order Items</h2>

        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-start pb-4">
            <div className="flex items-start gap-4">
              <img
                src={item.img}
                alt={item.name}
                className="w-30 h-24 object-cover shadow"
              />
              <div className="flex flex-col gap-1">
                <p className=" text-xl text-black flex flex-row pb-2">
                  {item.name}
                  <span className="ml-auto font-semibold text-black">
                    ₱{item.price}
                  </span>
                </p>

                {item.flavor && <span className="text-black text-lg">Flavor: {item.flavor}</span>}
                {item.size && <span className="text-black text-lg">Size: {item.size}</span>}

                <div className="flex items-center gap-25 justify-between w-full mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrement(item.id)}
                      className="text-black px-3 py-1 text-xl"
                    >
                      -
                    </button>
                    <span className="text-black font-medium">{item.quantity}</span>
                    <button
                      onClick={() => increment(item.id)}
                      className="text-black px-3 py-1 text-xl"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold text-black text-lg">
                    ₱ {item.price * item.quantity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Section */}
      <div className="fixed bottom-20 left-0 right-0 bg-[#C7AD7F] py-5 shadow-lg">
  <div className="max-w-md mx-auto flex flex-col gap-4 px-4">
    <div className="flex justify-between items-center text-3xl font-semibold text-black">
      <span>Total:</span>
      <span>₱ {total}</span>
    </div>

    <NavLink
      to="/checkoutpayment"
      className="bg-[#E7524E] text-black py-3 text-center text-3xl font-semibold transition hover:bg-red-600 rounded"
    >
      Check Out
    </NavLink>
  </div>
</div>


      {/* Navigation */}
      <div className="mt-10 sm:mt-12">
        <Navigation />
      </div>
    </section>
  );
}

export default CartModal;
