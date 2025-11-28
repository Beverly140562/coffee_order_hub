import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { ChevronLeft, Loader2 } from "lucide-react";
import { supabase } from "../config/supabase";

function ProductOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      const currentUser = authData?.user;

      if (authError || !currentUser) {
        navigate("/signup");
        return;
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError.message);
        setOrders([]);
      } else {
        setOrders(ordersData || []);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [navigate]);

  if (loading) return <p className="min-h-screen bg-[#C7AD7F] flex flex-col items-center justify-center pt-20 text-black text-3xl">
  <Loader2 className="w-10 h-10 animate-spin text-black mb-5" />

  <span className="loading-dots">Loading</span>
</p>;

  return (
    <section className="min-h-screen bg-[#C7AD7F] px-4 sm:px-6 py-10">
      <div className="flex items-center mb-10">
        <NavLink to="/profile" className="p-2 rounded-full hover:bg-gray-200 transition">
          <ChevronLeft size={60} className="text-black" />
        </NavLink>
        <h1 className="ml-4 text-3xl sm:text-4xl font-bold text-black">Orders</h1>
      </div>

      <div className="max-w-md mx-auto bg-[#D9D9D9] rounded-xl shadow p-4 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-black mb-4">Current Orders</h2>
        {orders.length === 0 && <p className="text-black text-lg">No orders yet</p>}

        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {orders.map((order) => {
            const orderDate = new Date(order.created_at);
            const formattedDate = orderDate.toLocaleDateString();
            const formattedTime = orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const items = order.items || []; 

            return (
              <div key={order.id} className="border-b border-gray-300 pb-2 last:border-b-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-black font-semibold">Payment: {order.payment}</p>
                  <p className="text-black font-semibold">Status: {order.status}</p>
                </div>

                <p className="text-black text-sm mb-1">
                  Date: {formattedDate} | Time: {formattedTime}
                </p>

                {items.map((item, index) => (
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
      </div>
    </section>
  );
}

export default ProductOrder;
