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
<<<<<<< HEAD
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
=======

function App() {
  return (
>>>>>>> 7b8ca11e9861644c7542e3d133bee3e120f69390
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
<<<<<<< HEAD
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartModal />} />
        <Route path="/about" element={<FavoritesProvider />} />
        <Route path="/checkout" element={<ProductOrder />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkoutpayment" element={<CheckOut />} />
=======

>>>>>>> 7b8ca11e9861644c7542e3d133bee3e120f69390

        {/* Admin section */}
        <Route path="/portal" element={<AdminPage />} />
        <Route path="/add-product" element={<AdminProduct />} />
        <Route path="/orders" element={<AdminManage />} />
      </Routes>
<<<<<<< HEAD
    </BrowserRouter></FavoritesProvider>
=======
    </BrowserRouter>
>>>>>>> 7b8ca11e9861644c7542e3d133bee3e120f69390
  );
}

export default App;
