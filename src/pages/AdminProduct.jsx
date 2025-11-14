import { Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

function AdminProduct({ showForm = true, showTable = true }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showMessage, setShowMessage] = useState('');
  const [form, setForm] = useState({ name: '', price: '', category: '', image_url: '', description: '' });

  // Load products from localStorage
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(savedProducts);
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

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
      id: products.length ? products[products.length - 1].id + 1 : 1,
      name: form.name,
      price: Number(form.price),
      category: form.category,
      image_url: form.image_url,
      description: form.description,
    };

    const updatedProducts = [...products, newProduct];

    setProducts(updatedProducts); // update state
    setForm({ name: '', price: '', category: '', image_url: '', description: '' });
    setShowMessage('✅ Product added successfully!');
    setTimeout(() => setShowMessage(''), 3000);

    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleDelete = (id) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // update storage immediately
  };

  return (
    <div className="min-h-screen bg-[#C7AD7F] p-5">
      <h2 className="text-2xl font-semibold text-black pb-5">Add Products</h2>
      <button
        onClick={() => navigate("/add-product")}
        className="flex items-center gap-2 text-lg font-semibold text-black mb-10 hover:text-amber-600 transition"
      >
        <Plus size={20} />
        Add New Coffee
      </button>

      {showForm && (
        <form onSubmit={handleAddProduct} className="p-6 rounded-lg shadow-md w-full mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full p-2 border border-black rounded"
            />
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              type="number"
              className="w-full p-2 border border-black rounded"
            />
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full p-2 border border-black rounded"
            />
            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full p-2 border border-black rounded"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border border-black rounded resize-none col-span-1 sm:col-span-2"
              rows={3}
            />
          </div>
          <button className="bg-amber-900 text-white w-full py-2 rounded hover:bg-amber-800 transition">
            Add Product
          </button>
          {showMessage && <p className="text-center text-green-600 mt-2">{showMessage}</p>}
        </form>
      )}

      {showTable && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-amber-100">
              <tr>
                <th className="px-4 py-2 border">Image</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-amber-50 transition">
                  <td className="px-4 py-2 border">
                    <img src={p.image_url} alt={p.name} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="px-4 py-2 border">{p.name}</td>
                  <td className="px-4 py-2 border">{p.category}</td>
                  <td className="px-4 py-2 border">₱{p.price}</td>
                  <td className="px-4 py-2 border max-w-xs truncate">{p.description}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:opacity-80 transition"
                    >
                      Delete
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
