import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import toast from "react-hot-toast";

export default function AdminManage() {
  const [orders, setOrders] = useState([]);

  // Fetch all orders from Supabase
  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("id, user_id, items, total, status, created_at, users(first_name)")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        toast.error("Failed to fetch orders");
        return;
      }

      // Map user name from related users table
      const formattedOrders = data.map((order) => ({
        ...order,
        userName: order.users?.first_name || "Guest",
      }));

      setOrders(formattedOrders);
    }

    fetchOrders();
  }, []);

  // Update order status in Supabase
  const handleStatusChange = async (orderId, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update order status");
      return;
    }

    // Update local state
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="w-full p-2">
      <h2 className="text-2xl pl-3 font-semibold text-black mb-6">Manage Orders</h2>

      <div className="max-h-[50vh] overflow-y-auto border-2">
        <table className="min-w-full overflow-hidden">
          <thead className="bg-[#C7AD7F]">
            <tr>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Items</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">Status</th>
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
                  <td className="px-4 py-2 border">
                    {order.userName} #{String(order.id).slice(0, 5)}
                  </td>
                  <td className="px-4 py-2 border">
                    {order.items.map((i) => i.name).join(", ")}
                  </td>
                  <td className="px-4 py-2 border">₱{order.total}</td>
                  <td className="px-4 py-2 border">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
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
    </div>
  );
}
