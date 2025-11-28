import React from 'react'
import { useNavigate } from 'react-router';
import Logout from "../assets/logout.png";


function AdminHeader() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
      };

  return (
    <div className=" w-full p-2 mt-5 flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold text-black">Admin Dashboard</h2>
        <button onClick={handleLogout} className=" text-white px-4 py-2 rounded hover:bg-red-700 transition">
            <img src={Logout} alt="Logo" className="w-15 h-15 object-cover" />
        </button>
    </div>
  )
}

export default AdminHeader