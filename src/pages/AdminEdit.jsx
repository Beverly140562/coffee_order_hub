import React, { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function AdminEdit() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    id: "",
    name: "",
    price: "",
    stocks: "",
    detail: "",
    description: "",
    image_url: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("editProduct"));
    if (data) setProduct(data);
  }, []);

  const handleImageUpload = async () => {
  if (!imageFile) return product.image_url;

  try {
    setUploading(true);

    const safeFileName = `${Date.now()}-${imageFile.name
      .replace(/\s+/g, "_")
      .replace(/[^\w.-]/g, "")}`;

    const { error: uploadError } = await supabase
      .storage
      .from("products")
      .upload(safeFileName, imageFile, { upsert: true });

    if (uploadError) throw uploadError;

    const publicUrl = supabase
      .storage
      .from("products")
      .getPublicUrl(safeFileName).data.publicUrl;

    setProduct(prev => ({ ...prev, image_url: publicUrl }));
    return publicUrl;

  } catch (err) {
    console.error(err);
    toast.error("Image upload failed: " + err.message);
    return product.image_url;
  } finally {
    setUploading(false);
  }
};


  const handleUpdate = async () => {
    const uploadedUrl = await handleImageUpload();

    const { error } = await supabase
      .from("products")
      .update({
        name: product.name,
        price: product.price,
        stocks: product.stocks,
        detail: product.detail,
        description: product.description,
        image_url: uploadedUrl,
      })
      .eq("id", product.id);

    if (error) toast.error("Error updating product: " + error.message);
    else {
      toast.success("Product updated successfully!");
      navigate("/home"); 
    }
  };

  return (
    <div className="p-5 max-w-lg mx-auto min-h-screen bg-[#FDF4EC]">
      <h2 className="text-3xl font-bold mt-5 mb-6">Edit Product</h2>

      {/* Product Name */}
      <input
        className="border p-2 w-full mb-3 text-lg rounded"
        value={product.name || ""}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        placeholder="Product Name"
      />

      {/* Price */}
      <input
        className="border p-2 w-full mb-3 text-lg rounded"
        type="number"
        value={product.price || ""}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        placeholder="Price"
      />

      {/* Stocks */}
      <input
        className="border p-2 w-full mb-3 text-lg rounded"
        type="number"
        value={product.stocks || ""}
        onChange={(e) => setProduct({ ...product, stocks: e.target.value })}
        placeholder="Stocks"
      />

      {/* Details */}
      <textarea
        className="border p-2 w-full mb-3 text-lg rounded"
        value={product.detail || ""}
        onChange={(e) => setProduct({ ...product, detail: e.target.value })}
        placeholder="Details"
        rows={3}
      />

      {/* Description */}
      <textarea
        className="border p-2 w-full mb-3 text-lg rounded"
        value={product.description || ""}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        placeholder="Description"
        rows={4}
      />

      {/* Save Button */}
      <button
        onClick={handleUpdate}
        disabled={uploading}
        className={`w-full py-2 rounded text-white ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {uploading ? "Uploading..." : "Save Changes"}
      </button>
    </div>
  );
}
