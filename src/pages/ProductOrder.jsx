import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";

function ProductOrder() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  return (
    <section className="min-h-screen bg-[#C7AD7F] px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center mb-10">
        <NavLink to="/profile" className="p-2 rounded-full hover:bg-gray-200 transition">
          <ChevronLeft size={60} className="text-black" />
        </NavLink>
        <h1 className="ml-4 text-3xl sm:text-4xl font-bold text-black">
          Orders
        </h1>
      </div>

      {/* Orders List */}
      <div className="max-w-md mx-auto bg-[#D9D9D9] rounded-xl shadow p-4 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-black mb-4">Current Orders</h2>
        {orders.length === 0 && <p className="text-black text-lg">No orders yet</p>}
        
        {orders.map((order) => {
          const orderDate = new Date(order.timestamp);
          const formattedDate = orderDate.toLocaleDateString(); 
          const formattedTime = orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 

          return (
            <div key={order.id} className="border-b border-gray-300 pb-2 last:border-b-0">
              <div className="flex justify-between items-center mb-1">
                <p className="text-black font-semibold">Payment: {order.payment}</p>
                <p className="text-black font-semibold">Status: {order.status}</p>
              </div>

              <p className="text-black text-sm mb-1">
                Date: {formattedDate} | Time: {formattedTime}
              </p>

              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-1">
                  <p className="text-black">{item.quantity} x {item.name}</p>
                  <p className="text-black">₱{item.price * item.quantity}</p>
                </div>
              ))}

              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-400">
                <span className="font-semibold text-lg text-black">Total</span>
                <span className="font-bold text-lg text-black">₱ {order.total}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ProductOrder;
