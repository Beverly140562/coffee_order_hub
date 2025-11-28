import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Briefcase, ArrowLeft } from "lucide-react";
import { useNavigate, NavLink } from "react-router";
import { supabase } from "../config/supabase";
import toast from "react-hot-toast";

export default function Registration({ register }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(register === "login");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    try {
      let user;

      if (isLogin) {
        // LOGIN
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError || !loginData.user) {
          toast.error(loginError?.message || "Login failed");
          return;
        }
        user = loginData.user;

      } else {
        // SIGNUP
        if (!formData.first_name || !formData.last_name || !formData.role) {
          toast.error("First name, last name, and role are required.");
          return;
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError || !signUpData.user) {
          toast.error(signUpError?.message || "Signup failed");
          return;
        }

        const userId = signUpData.user.id;

        // Save user details in users table
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: userId,
            first_name: formData.first_name,
            last_name: formData.last_name,
            role: formData.role.toLowerCase(),
            email,
          },
        ]);
        if (insertError) {
          toast.error(insertError.message);
          return;
        }

        // Auto-login after signup
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError || !loginData.user) {
          toast.error("Signup successful but auto-login failed. Please log in manually.");
          return;
        }
        user = loginData.user;
      }

      // Get role from users table
      const { data: userData, error } = await supabase
      .from("users")
      .select("role, first_name, last_name")
      .eq("id", user.id)
      .single();
      if (error || !userData) {
        toast.error("User role not found. Contact admin.");
        return;
      }

      // Save user to localStorage
      const role = userData.role.toLowerCase();
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          email,
          role,
          first_name: userData.first_name,
          last_name: userData.last_name,
        })
      );

      // Navigate based on role
      if (role === "admin") navigate("/portal");
      else navigate("/menu");

    } catch (err) {
      console.error("Auth error:", err);
      toast(err.message || "Something went wrong");
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ first_name: "", last_name: "", role: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-[#C7AD7F] flex justify-center items-start p-4 sm:p-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <NavLink to="/landing" className="text-black">
            <ArrowLeft size={40} />
          </NavLink>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-black text-center flex-1 pt-10">
            Coffee Hub
          </h1>
          <div className="w-8" />
        </div>

        <h2 className="text-3xl md:text-4xl font-semibold text-black mb-12">
          {isLogin ? "Sign In" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
                  <input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className="w-full pl-11 py-3 border outline-none"
                  />
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
                  <input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className="w-full pl-11 py-3 border outline-none"
                  />
                </div>
              </div>

              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
                <input
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="Role: admin or user"
                  className="w-full pl-11 py-3 border outline-none"
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full pl-11 py-3 border outline-none"
              autoComplete="username"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              className="w-full pl-11 pr-12 py-3 border outline-none"
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full text-black border py-3 text-xl font-semibold transition hover:-translate-y-1 hover:shadow-xl"
          >
            {isLogin ? "Sign in" : "Sign Up"}
          </button>
        </form>

        <div className="mt-12 text-center text-sm text-black">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={toggleForm} className="font-semibold hover:underline">
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
