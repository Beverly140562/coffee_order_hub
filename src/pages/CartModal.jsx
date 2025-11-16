import React, { useState, useEffect } from "react";
import { NavLink } from "react-router";
import Navigation from "./Navigation";
import { useNavigate } from "react-router";

function CartModal() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const updateQuantity = (index, delta) => {
    const updatedCart = [...cartItems];
    const newQuantity = updatedCart[index].quantity + delta;
    if (newQuantity < 1) return; // prevent negative quantity
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemove = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

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
    <section className="min-h-screen bg-[#C7AD7F] ">
      <h1 className="text-4xl mb-8  font-semibold text-black pl-5 pt-10">Cart</h1>
      <p className="text-3xl pb-2 font-semibold pl-5">Order Items</p>

      <div className="space-y-1 max-h-[50vh] overflow-y-auto px-1">
  {cartItems.map((item, index) => (
    <div key={index} className="flex justify-between items-center p-4">
      <div className="flex items-center gap-4">
        <img src={item.img} alt={item.name} className="w-30 h-32 object-cover" />

        <div className="flex flex-col justify-between">
          {/* Name and price */}
          <div className="flex justify-between w-full">
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <span className="text-2xl">₱ {item.price}</span>
          </div>

          <p className="pt-2 text-lg">Flavor: {item.flavor || "None"}</p>
          <p className="text-lg">Size: {item.size}</p>

          {/* Quantity controls */}
          <div className="flex items-center gap-7 mt-2">
            <button
              onClick={() => updateQuantity(index, -1)}
              className="text-black text-xl font-bold px-3 py-1 "
            >
              -
            </button>
            <span className="text-lg font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(index, 1)}
              className="text-black text-xl font-bold px-3 py-1 "
            >
              +
            </button>

            {/* Subtotal */}
            <span className="ml-4 text-2xl ">₱ {item.price * item.quantity}</span>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>


        {/* Total */}
        <div className="flex justify-end items-center gap-2 p-4 mt-6 mb-8">
          <h2 className="text-3xl ">Total: </h2>
          <span className="text-3xl">₱ {getTotal()}</span>
        </div>

        <button onClick={() => navigate("/checkout")} className=" bg-[#E7524E] text-black px-30 py-2 m-8 text-3xl transition">
          Checkout
        </button>
    

      {/* Bottom Nav */}
      <div className="mt-10 sm:mt-12">
        <Navigation />
      </div>
    </section>
  );
}

export default CartModal;