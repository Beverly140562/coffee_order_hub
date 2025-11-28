import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import { supabase } from "../config/supabase";
import toast from "react-hot-toast";

function AdminProduct({ showForm = true, showTable = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image_url: "",
    description: "",
    detail:"",
  });
  const [showMessage, setShowMessage] = useState("");

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
      if (error) {
        console.error(error);
        return;
      }
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
  e.preventDefault();

  if (!form.name || !form.price || !form.category) {
    toast.error("Please fill in all required fields!");
    return;
  }

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        image_url: form.image_url,
        description: form.description,
        detail: form.detail,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    toast.error("Failed to add product");
    return;
  }

  setProducts([...products, data[0]]);
  setForm({ name: "", price: "", category: "", image_url: "", description: "", detail: "", });
  setShowMessage("✅ Product added successfully!");
  setTimeout(() => setShowMessage(""), 3000);
};


  const handleDelete = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error(error);
      toast.error("Failed to delete product");
      return;
    }
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
        <button onClick={() => navigate("/add-product")} className={buttonClass}>
          <Plus size={20} /> Add New Coffee
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddProduct} className="p-6 mb-8 m-5 space-y-4 border backdrop-blur">
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
            <textarea
              name="detail"
              value={form.detail}
              onChange={handleChange}
              placeholder="Detail"
              className="w-full p-2 border-2 border-black rounded resize-none col-span-1 sm:col-span-2"
              rows={2}
            />
          </div>

          <button className="bg-[#8B4411] mt-20 text-black text-2xl font-semibold w-full py-2 border-2 rounded transition">
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
                <th className="px-5 py-2 border">Price</th>
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
                    <button onClick={() => handleDelete(p.id)} className="px-3 py-1 transition">
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
