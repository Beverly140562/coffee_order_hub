import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Briefcase, ArrowLeft } from "lucide-react";
import { useNavigate, NavLink } from "react-router";

export default function Register() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      if (formData.role.toLowerCase() === "admin") {
        navigate("/portal"); // Admin dashboard
      } else {
        navigate("/menu"); // User landing page
      }
      alert(`✅ Logged in as ${formData.email}`);
    } else {
      alert(`✅ Account created for ${formData.email}`);
      setIsLogin(true);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      first_name: "",
      last_name: "",
      role: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#C7AD7F] flex p-4 ">
      <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-10">
          <NavLink
            to="/landing"
            className="text-black transition pb-15"
          >
            <ArrowLeft size={40} />
          </NavLink>
          <h1 className="text-6xl font-semibold text-black text-center flex-1 pt-20">
            Coffee Hub
          </h1>
          <div className="w-7" />
        </div>

        {/* Form Header */}
        <h2 className="text-3xl font-semibold text-black mb-8 mt-20">
          {isLogin ? "Sign In" : "Sign Up"}
        </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          placeholder="First Name"
                          className="w-full pl-11 pr-4 py-3 border outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          placeholder="Last Name"
                          className="w-full pl-11 pr-4 py-3 border outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        placeholder="Role: admin or user"
                        className="w-full pl-11 pr-4 py-3 border outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3 border outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={
                      isLogin ? "Enter your password" : "Create a password"
                    }
                    className="w-full pl-11 pr-12 py-3 border outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-black"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <button type="button" className="pt-1 pb-20 text-center text-lg text-black">
                  {isLogin ? "Forgot the password?" : ""}
                </button>
              </div> 
              

              <button
                type="submit"
                className="w-full text-black border py-3 text-xl font-semibold transition hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLogin ? "Sign in" : "Sign Up"}
              </button>
            </form>

            <div className="mt-15 text-center text-sm text-black">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                onClick={toggleForm}
                className="text-black font-semibold hover:text-amber-700 hover:underline"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </div>
      </div>
    </div>
  );
}
