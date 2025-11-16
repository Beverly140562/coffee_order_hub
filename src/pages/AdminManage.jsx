import React, { useState, useEffect } from 'react';

function AdminManage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const allOrders = [];
    for (let key in localStorage) {
      if (key.startsWith("orders_")) {
        const userOrders = JSON.parse(localStorage.getItem(key)) || [];
        const userName = key.replace("orders_", "");
        userOrders.forEach(order => order.userName = userName);
        allOrders.push(...userOrders);
      }
    }
    setOrders(allOrders);
  }, []);

  const handleStatusChange = (orderId, userName, newStatus) => {
    const userOrders = JSON.parse(localStorage.getItem(`orders_${userName}`)) || [];
    const updatedOrders = userOrders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem(`orders_${userName}`, JSON.stringify(updatedOrders));

    setOrders(prev =>
      prev.map(order =>
        order.id === orderId && order.userName === userName
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  return (
    <div className="w-full p-2">
      <h2 className="text-2xl pl-3 font-semibold text-black mb-6">Manage Orders</h2>

      <div className="max-h-[30vh] overflow-y-auto border-2">
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
                      onChange={(e) =>
                        handleStatusChange(order.id, order.userName, e.target.value)
                      }
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

export default AdminManage;
