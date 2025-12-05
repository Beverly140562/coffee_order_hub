import { Coffee, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import toast from "react-hot-toast";
import AdminNavbar from "./AdminNavbar";

function AdminProduct({ showForm = true, showTable = false }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stocks: "",
    category: "",
    image_url: "",
    description: "",
    detail: "",
  });
  const [showMessage, setShowMessage] = useState("");

 
  useEffect(() => {
    async function fetchProductsFromMenu() {
      const { data, error } = await supabase
        .from("menu")
        .select("product_id, products(*)")
        .order("product_id", { ascending: true });

      if (error) {
        console.error(error);
        toast.error("Failed to fetch menu products");
        return;
      }

      const allProducts = data.map((item) => item.products);

      setProducts(allProducts);
    }

    fetchProductsFromMenu();
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stocks || !form.category) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert([
        {
          name: form.name,
          price: Number(form.price),
          stocks: Number(form.stocks),
          category: form.category,
          image_url: form.image_url,
          description: form.description,
          detail: form.detail,
        },
      ])
      .select();

    if (productError) {
      console.error(productError);
      toast.error("Failed to add product");
      return;
    }

    const newProduct = productData[0];

    const { error: menuError } = await supabase
      .from("menu")
      .insert([{ product_id: newProduct.id }]);

    if (menuError) {
      console.error(menuError);
      toast.error("Failed to add product to menu");
      return;
    }

    setProducts((prev) => [...prev, newProduct]);
    setForm({
      name: "",
      price: "",
      stocks: "",
      category: "",
      image_url: "",
      description: "",
      detail: "",
    });

    setShowMessage("✅ Product added successfully!");
    setTimeout(() => setShowMessage(""), 3000);
  };


  const handleDelete = async (id) => {
  try {
    console.log("Deleting menu for product:", id);

    // Delete from menu
    const { error: menuError } = await supabase
      .from("menu")
      .delete()
      .eq("product_id", id);

    if (menuError) {
      console.error(menuError);
      toast.error("Failed to remove product from menu");
      return;
    }

    const { error: productError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (productError) {
      console.error(productError);
      toast.error("Failed to delete product");
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Deleted Successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Unexpected error deleting product");
  }
};


  return (
    <div className="w-full min-h-screen bg-[#C7AD7F] p-4">
      
      {showForm && (
        <form
          onSubmit={handleAddProduct}
          className="max-w-4xl mx-auto p-4 text-xl space-y-4"
        >
          <h2 className="flex items-center gap-2 text-4xl text-black mb-5 font-semibold mt-4">
            Add Products{" "}
            <Coffee size={40} className="text-black fill-[#8B4411]" />
          </h2>

          {showMessage && (
            <p className="text-center text-green-600 font-semibold mt-2">
              {showMessage}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#E8E0E0] pl-3  pr-3 rounded-lg shadow-md border pt-8 pb-8">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full p-3 border-2 border-black focus:ring-2 focus:ring-[#8B4411]"
            />

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              type="number"
              className="w-full p-3 border-2 border-black focus:ring-2 focus:ring-[#8B4411]"
            />

            <input
              name="stocks"
              value={form.stocks}
              onChange={handleChange}
              placeholder="Stocks"
              type="number"
              className="w-full p-3 border-2 border-black focus:ring-2 focus:ring-[#8B4411]"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 border-2 border-black focus:ring-2 focus:ring-[#8B4411]"
            >
              <option value="">Select Category</option>
              <option value="Hot Coffee">Hot Coffee</option>
              <option value="Cold Coffee">Cold Coffee</option>
              <option value="Frappuccino">Frappuccino</option>
            </select>

            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full p-3 border-2 border-black focus:ring-2 focus:ring-[#8B4411] col-span-1 sm:col-span-2"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-3 border-2 border-black resize-none col-span-1 sm:col-span-2 focus:ring-2 focus:ring-[#8B4411]"
              rows={3}
            />

            <textarea
              name="detail"
              value={form.detail}
              onChange={handleChange}
              placeholder="Detail"
              className="w-full p-3 border-2 border-black resize-none col-span-1 sm:col-span-2 focus:ring-2 focus:ring-[#8B4411]"
              rows={2}
            />

            <button
              type="submit"
              className="w-full py-1 mb-2 mt-4 bg-[#8B4411] border-2 text-black text-3xl font-bold rounded-lg hover:bg-[#A35B1C] transition col-span-1 sm:col-span-2"
            >
              Add Product
            </button>
          </div>
        </form>
      )}

  
      {showTable && (
        <div className="w-full overflow-x-auto mt-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-5 ml-5">Manage Products</h2>
          <div className="max-h-[70vh] overflow-y-auto border-2 rounded-lg shadow-lg">
            <table className="min-w-full table-auto border-collapse">
              <thead className=" text-lg text-black sticky top-0 z-10 bg-[#C7AD7F]">
                <tr>
                  <th className="px-5 py-2 border text-left">Coffee Name</th>
                  <th className="px-2 py-2 border text-left">Category</th>
                  <th className="px-2 py-2 border text-left">Price</th>
                  <th className="px-2 py-2 border text-center">Stocks</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="bg-[#E8E0E0] text-base sm:text-lg transition"
                  >
                    <td className="px-2 py-2 border text-left break-words">
                      {p.name}
                    </td>
                    <td className="px-2 py-2 border text-left">
                      {p.category}
                    </td>
                    <td className="px-2 py-2 border text-left">
                      ₱{p.price}
                    </td>
                    <td className="px-2 py-2 border text-center">
                      {p.stocks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AdminNavbar />
    </div>
  );
}

export default AdminProduct;
