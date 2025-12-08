import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import toast from "react-hot-toast";
import AdminNavbar from "./AdminNavbar";

export default function AdminManage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            id, user_id, items, total, status, created_at, pickup,
            users(last_name)
          `)
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;

        const formattedOrders = data.map((order) => ({
          ...order,
          userName: order.users?.last_name || "Guest",
        }));

        setOrders(formattedOrders);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch orders");
      }
    }

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
  try {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (newStatus === "Completed") {
      for (const item of order.items) {
        if (!item.id) {
          console.warn(`Skipping stock update: item.id is missing for ${item.name}`);
          continue; 
        }

        const { data: productData, error: fetchError } = await supabase
          .from("products")
          .select("id, stocks, name, stock_status")
          .eq("id", item.id)
          .single();

        if (fetchError) {
          console.error(`Failed to fetch product ${item.name}`, fetchError);
          continue;
        }

        let newStock = (productData.stocks || 0) - (item.quantity || 0);
        if (newStock < 0) newStock = 0;

        let stockStatus = "In Stock";
        if (newStock === 0) stockStatus = "Out of Stock";
        else if (newStock <= 1) stockStatus = "Run Out Soon";

        const { error: updateError } = await supabase
          .from("products")
          .update({ stocks: newStock, stock_status: stockStatus })
          .eq("id", productData.id);

        if (updateError) {
          console.error(`Failed to update stock for ${item.name}`, updateError);
        }
      }
    }

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Failed to update order status", error);
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  } catch (err) {
    console.error("Error updating order and stock", err);
  }
};


  return (
    <div className="w-full p-2 bg-[#C7AD7F] min-h-screen">
      <h2 className="text-3xl pl-3 font-semibold text-black mt-6 mb-6">Manage Orders</h2>

      <div className="max-h-[75vh] bg-[#E8E0E0] overflow-y-auto border-2 rounded-lg shadow-lg text-black">
        <table className="w-full border-collapse">
          <thead className="bg-[#C7AD7F] sticky top-0 text-xl">
            <tr>
              <th className="px-2 py-2 border">Customer / OR#</th>
              <th className="px-2 py-2 border">Items</th>
              <th className="px-2 py-2 border">Total</th>
              <th className="px-2 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-black">
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="transition">
                  <td className="px-2 py-2 border">
                   OR#{String(order.id).slice(0, 8).toUpperCase()} <br />
                    {order.pickup} | {order.created_at.slice(0, 10)}
                  </td>
                  <td className="px-2 py-2 border">
                    {order.items
                      .map((i) => `${i.name} (${i.size}, ${i.flavor}, x${i.quantity})`)
                      .join(", ")}
                  </td>
                  <td className="px-2 py-2 border">₱{order.total}</td>
                  <td className="px-2 py-2 border">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border rounded py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Ready for Pickup">Ready</option>
                      <option value="Completed">Completed</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminNavbar />
    </div>
  );
}
