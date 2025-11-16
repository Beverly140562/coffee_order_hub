import { ChevronLeft, Plus, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useLocation } from "react-router";

function AdminProduct({ showForm = true, showTable = true }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [showMessage, setShowMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    image_url: '',
    description: ''
  });

  const location = useLocation();

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(savedProducts);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem('products', JSON.stringify(products));
  }, [products, initialized]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      alert("Please fill in all required fields!");
      return;
    }

    const newProduct = {
      id: crypto.randomUUID(),
      name: form.name,
      price: Number(form.price),
      category: form.category,
      image_url: form.image_url,
      description: form.description,
    };

    setProducts([...products, newProduct]);

    setForm({
      name: '',
      price: '',
      category: '',
      image_url: '',
      description: ''
    });

    setShowMessage('✅ Product added successfully!');
    setTimeout(() => setShowMessage(''), 3000);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const buttonClass = `flex items-center gap-2 text-2xl px-5 py-2 font-semibold text-black mb-5 hover:text-amber-600 transition ${
    location.pathname === "/portal" ? "border" : ""
  }`;

  return (
    <div className="w-full pb-10 bg-[#C7AD7F]">

      {location.pathname !== "/portal" && (
        <NavLink to="/portal" className="p-2 transition">
          <ChevronLeft size={60} className="text-black" />
        </NavLink>
      )}

      <h2 className="text-3xl font-semibold text-black pl-10 pb-3">Add Products</h2>

      <div className="flex justify-center">
        <button
          onClick={() => navigate("/add-product")}
          className={buttonClass}
        >
          <Plus size={20} />
          Add New Coffee
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddProduct} className="p-6 mb-8 m-5 space-y-4 border  backdrop-blur">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full p-2 border-2 border-black rounded"
            />

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              type="number"
              className="w-full p-2 border-2 border-black rounded"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border-2 border-black rounded"
            >
              <option value="">Category</option>
              <option value="Hot Coffee">Hot Coffee</option>
              <option value="Cold Coffee">Cold Coffee</option>
              <option value="Frappuccino">Frappuccino</option>
            </select>

            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full p-2 border-2 border-black rounded"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border-2 border-black rounded resize-none col-span-1 sm:col-span-2"
              rows={3}
            />
          </div>

          <button className="bg-[#8B4411] mt-10 text-black text-2xl font-semibold w-full py-2 border-2 rounded transition">
            Add Product
          </button>

          {showMessage && <p className="text-center text-green-600 mt-2">{showMessage}</p>}
        </form>
      )}

      {showTable && (
        <div className="max-h-[30vh] overflow-y-auto border-2 backdrop-blur">
          <table className="min-w-full table-fixed">
            <thead className="sticky top-0 bg-[#C7AD7F] z-10">
              <tr>
                <th className="px-4 py-2 border">Coffee Name</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Delete</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="transition">
                  <td className="px-4 py-2 text-center border">{p.name}</td>
                  <td className="px-4 py-2 text-center border">{p.category}</td>
                  <td className="px-4 py-2 text-center border">₱ {p.price}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 transition"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}

export default AdminProduct;
