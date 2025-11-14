import { Plus } from 'lucide-react';
<<<<<<< HEAD
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

=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function AdminProduct({ showForm = true, showTable = false }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Espresso',
      price: 120,
      category: 'Coffee',
      image_url: 'data:image/jpeg;base64,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', // truncated
    },
    {
      id: 2,
      name: 'Cheesecake',
      price: 150,
      category: 'Dessert',
      image_url: 'https://th.bing.com/th/id/OIP.RuhRats2q7R-vNG5SziYDAHaHa?w=202&h=202&c=7&r=0&o=7&cb=ucfimg2&dpr=1.5&pid=1.7&rm=3&ucfimg=1',
    },
  ]);

  const [showMessage, setShowMessage] = useState('');
  const [form, setForm] = useState({ name: '', price: '', category: '', image_url: '', description: '' });

>>>>>>> 7b8ca11e9861644c7542e3d133bee3e120f69390
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = (e) => {
<<<<<<< HEAD
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
=======
  e.preventDefault();
  const newProduct = {
    id: products.length + 1,
    name: form.name,
    price: Number(form.price),
    category: form.category,
    image_url: form.image_url,
    description: form.description, 
  };
  setProducts([...products, newProduct]);
  setForm({ name: '', price: '', category: '', image_url: '', description: '' });
  setShowMessage('✅ Product added successfully!');
  setTimeout(() => setShowMessage(''), 3000);
};

const handleProduct = () => {
    navigate("/add-product"); 
  };



  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="w-full max-w-5xl mt-8 px-4 mx-auto">
  {/* Add Product Form */}
  <h2 className="text-2xl m-3 font-semibold text-black mb-2">Add Products</h2>
  <button
  onClick={handleProduct}
  className="flex items-center gap-2 text-lg font-semibold text-black mb-10 hover:text-amber-600 transition"
>
  <Plus size={20} />
  Add New Coffee
</button>
  {showForm && (
  <form
    onSubmit={handleAddProduct}
    className="bg-white p-6 rounded-lg shadow-md w-full mb-8 space-y-4"
  > 
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        type="number"
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        name="image_url"
        value={form.image_url}
        onChange={handleChange}
        placeholder="Image URL"
        className="w-full p-2 border border-gray-300 rounded"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 border border-gray-300 rounded resize-none col-span-1 sm:col-span-2"
        rows={3}
      />
    </div>
    <button className="bg-amber-900 text-white w-full py-2 rounded hover:bg-amber-800 transition">
      Add Product
    </button>
    {showMessage && <p className="text-center text-green-600 mt-2">{showMessage}</p>}
  </form>

  )}

  {/* Products Table */}
  {showTable &&  (
>>>>>>> 7b8ca11e9861644c7542e3d133bee3e120f69390
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
<<<<<<< HEAD
                    <img src={p.image_url} alt={p.name} className="w-16 h-16 object-cover rounded" />
=======
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded"
                    />
>>>>>>> 7b8ca11e9861644c7542e3d133bee3e120f69390
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
<<<<<<< HEAD
    </div>
=======
</div>

>>>>>>> 7b8ca11e9861644c7542e3d133bee3e120f69390
  );
}

export default AdminProduct;
