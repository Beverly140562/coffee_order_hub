import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Logout from "../assets/logout.png";
import AdminNavbar from './AdminNavbar';
import { supabase } from '../config/supabase';

function AdminHeader() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, stocks, image_url, detail, stock_status");

    if (error) console.error(error);
    else setProducts(data);
  }

  async function deleteProduct(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) console.error(error);
    else fetchProducts();
  }

  const handleEdit = (product) => {
    localStorage.setItem("editProduct", JSON.stringify(product));
    navigate("/edit-product");
  };

  const handleLogout = () => navigate('/login');

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-[#C7AD7F] ">
      <div className="w-full flex justify-between items-center p-3 sm:p-4 gap-3 
fixed top-0 left-0 right-0 bg-[#C7AD7F]  shadow-md z-50">

  <h2 className="text-2xl sm:text-3xl font-semibold">Admin Dashboard</h2>

  <button
    onClick={handleLogout}
    className=" text-white  rounded flex items-center gap-2"
  >
    <img src={Logout} alt="Logout" className="w-15 h-15" />
  </button>
</div>


      <h2 className="text-2xl sm:text-2xl font-bold mb-5 mt-20">Products List</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20 border-2 p-4 rounded-lg">
        {products.map((item) => (
          <div
            key={item.id}
            className=" pb-4 pl-3 pr-3 pt-1 shadow-md bg-[#E8E0E0] hover:shadow-lg transition"
          >
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-75 object-cover rounded mb-3"
            />

            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-lg text-gray-700"><strong>Price:</strong> ₱{item.price}</p>
            <p className="text-lg text-gray-700"><strong>Stocks:</strong> {item.stocks} {item.stock_status}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(item)}
                className="bg-blue-500 hover:bg-blue-600 text-white flex-1 py-1 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProduct(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white flex-1 py-1 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <AdminNavbar />
    </div>
  );
}

export default AdminHeader;
