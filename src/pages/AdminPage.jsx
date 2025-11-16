import React from 'react';
import { useNavigate } from 'react-router';
import AdminProduct from './AdminProduct';
import AdminManage from './AdminManage';

function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen bg-[#C7AD7F] p-1 items-center">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full flex justify-between items-center">
        <h2 className="text-2xl font-bold text-amber-900">☕ Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Product Form + List */}
      <AdminProduct showForm={false} showTable={true} />

      <AdminManage />
    </div>
  );
}

export default AdminPage;
