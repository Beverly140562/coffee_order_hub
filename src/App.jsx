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
import { FavoritesProvider } from "./pages/FavoritesContext";
import ProductDetails from "./pages/ProductDetails";
import CartModal from "./pages/CartModal";
import CheckoutPage from "./pages/CheckOutPage";
import ProfilePage from "./pages/ProfilePage";
import ProductOrder from "./pages/ProductOrder";

function App() {
  return (
    <FavoritesProvider>
      <BrowserRouter>
        <Toaster position="top-center" />

        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<LandingPage />} />

          {/* Landing/Login/Registration */}
          <Route path="/landing" element={<LoadingPage />} />
          <Route path="/signup" element={<Registration />} />
          <Route path="/login" element={<Registration />} />

          {/* User pages */}
          <Route path="/menu" element={<ProductSection />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartModal />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/product-orders" element={<ProductOrder />} />


          {/* Admin pages */}
          <Route path="/portal" element={<AdminPage />} />
          <Route path="/add-product" element={<AdminProduct />} />
          <Route path="/orders" element={<AdminManage />} />

          <Route path="*" element={<Navigate to="/landing" />} />
        </Routes>
      </BrowserRouter>
    </FavoritesProvider>
  );
}

export default App;