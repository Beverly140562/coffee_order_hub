import React from 'react';
import { useNavigate } from 'react-router';
import AdminProduct from './AdminProduct';
import AdminManage from './AdminManage';

function AdminPage() {
  const navigate = useNavigate();

<<<<<<< HEAD
=======

>>>>>>> 7b8ca11e9861644c7542e3d133bee3e120f69390
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen bg-[#C7AD7F] p-1 items-center">
      {/* Header */}
<<<<<<< HEAD
      <div className="bg-white p-6 rounded-lg shadow-md w-full flex justify-between items-center">
=======
      <div className="bg-white p-6 rounded-lg shadow-md w-full w-full flex justify-between items-center">
>>>>>>> 7b8ca11e9861644c7542e3d133bee3e120f69390
        <h2 className="text-2xl font-bold text-amber-900">☕ Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Product Form + List */}
<<<<<<< HEAD
      <AdminProduct showForm={false} showTable={true} />
=======
      <AdminProduct showForm={false} showTable={true}  />
>>>>>>> 7b8ca11e9861644c7542e3d133bee3e120f69390

      <AdminManage />
    </div>
  );
}

export default AdminPage;
