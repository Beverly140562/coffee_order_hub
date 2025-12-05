import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import ProductSection from "./pages/ProductSection";
import AdminPage from "./pages/AdminPage";
import Registration from "./pages/Registration";
import LandingPage from "./pages/LandingPage";
import AdminProduct from "./pages/AdminProduct";
import AdminManage from "./pages/AdminManage";
import LoadingPage from "./pages/LoadingPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProductDetails from "./pages/ProductDetails";
import CartModal from "./pages/CartModal";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import ProductOrder from "./pages/ProductOrder";
import AdminHeader from "./pages/AdminHeader";
import AdminEdit from "./pages/AdminEdit";

function App() {
  return (
  
      <BrowserRouter>
        <Toaster position="top-center" />

        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<LandingPage />} />

          {/* Landing/Login/Registration */}
          <Route path="/landing" element={<LoadingPage />} />
          <Route path="/signup" element={<Registration register="signup" />} />
          <Route path="/login" element={<Registration register="login" />} />


          {/* User pages */}
          <Route path="/menu" element={<ProductSection />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartModal />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/product-orders" element={<ProductOrder />} />


          {/* Admin pages */}
          <Route path="/products" element={<AdminPage />} />
          <Route path="/add-product" element={<AdminProduct />} />
          <Route path="/orders" element={<AdminManage />} />
          <Route path="/home" element={<AdminHeader/>} />
          <Route path="/edit-product" element={<AdminEdit />} />

          <Route path="*" element={<Navigate to="/landing" />} />
        </Routes>
      </BrowserRouter>
  
  );
}

export default App;