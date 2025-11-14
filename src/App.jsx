import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import ProductSection from "./pages/ProductSection";
import AboutSection from "./pages/AboutSection";
import Footer from "./pages/Footer";
import AdminPage from "./pages/AdminPage";
import Registration from "./pages/Registration";
import LandingPage from "./pages/LandingPage";
import AdminProduct from "./pages/AdminProduct";
import AdminManage from "./pages/AdminManage";
import LoadingPage from "./pages/LoadingPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import CartModal from "./pages/CartModal";
import { FavoritesProvider } from "./pages/FavoritesContext"
import ProductOrder from "./pages/ProductOrder";
import MenuCart from "./pages/ProductDetails";
import ProductDetails from "./pages/ProductDetails";
import CheckOut from "./pages/CheckOut";

function App() {
  return (
    <FavoritesProvider>
    <BrowserRouter>
      <Toaster position="top-center" />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/*  login/registration */}
        <Route path="/landing" element={<LoadingPage />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/login" element={<Registration />} />


        {/* User site */}
        <Route path="/menu" element={<ProductSection />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartModal />} />
        <Route path="/about" element={<FavoritesProvider />} />
        <Route path="/checkout" element={<ProductOrder />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkoutpayment" element={<CheckOut />} />

        {/* Admin section */}
        <Route path="/portal" element={<AdminPage />} />
        <Route path="/add-product" element={<AdminProduct />} />
        <Route path="/orders" element={<AdminManage />} />
      </Routes>
    </BrowserRouter></FavoritesProvider>
  );
}

export default App;
