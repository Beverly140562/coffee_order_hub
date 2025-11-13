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

function App() {
  return (
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


        {/* Admin section */}
        <Route path="/portal" element={<AdminPage />} />
        <Route path="/add-product" element={<AdminProduct />} />
        <Route path="/orders" element={<AdminManage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
