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
    last_name: "",
    role: "",
    email: "",
    password: "",
  });

  const allowedRoles = ["admin", "user", "guest"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email.trim();
    const password = formData.password;
    const role = formData.role.toLowerCase();

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }
    if (!isLogin && (!formData.last_name || !role)) {
      toast.error("Last name and role are required.");
      return;
    }
    if (!isLogin && !allowedRoles.includes(role)) {
      toast.error(`Role must be one of: ${allowedRoles.join(", ")}`);
      return;
    }

    try {
      let user;

      if (isLogin) {
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError || !loginData.user) {
          toast.error(loginError?.message || "Login failed");
          return;
        }
        user = loginData.user;
      } else {
        
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", email)
          .single();

        if (existingUser) {
          toast.error("Email already registered. Please log in.");
          return;
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError || !signUpData.user) {
          toast.error(signUpError?.message || "Signup failed");
          return;
        }

        const userId = signUpData.user.id;

        const { error: insertError } = await supabase.from("users").insert([
          {
            id: userId,
            last_name: formData.last_name,
            role,
            email,
          },
        ]);
        if (insertError) {
          toast.error(insertError.message);
          return;
        }

        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError || !loginData.user) {
          toast.error("Signup succeeded but auto-login failed. Please login manually.");
          return;
        }
        user = loginData.user;
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("role, last_name")
        .eq("id", user.id)
        .single();

      if (error || !userData) {
        toast.error("User role not found.");
        return;
      }

      const userRole = userData.role.toLowerCase();

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          email,
          role: userRole,
          last_name: userData.last_name,
        })
      );

      // Redirect based on role
      if (userRole === "admin") navigate("/home");
      else navigate("/menu");
    } catch (err) {
      console.error("Auth error:", err);
      toast.error(err.message || "Something went wrong");
    }
  };

const handleGuestLogin = async () => {
  try {
    const guestId = crypto.randomUUID();
    const guestEmail = `guest_${guestId}@guest.com`;
    const guestPassword = crypto.randomUUID(); 

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: guestEmail,
      password: guestPassword,
    });

    if (signUpError) {
      toast.error("Guest signup failed: " + signUpError.message);
      console.error("Supabase Auth error:", signUpError);
      return;
    }

    const userId = signUpData.user.id;

    const { error: insertError } = await supabase.from("users").upsert(
      [
        {
          id: userId,
          last_name: "Guest",
          role: "guest",
          email: guestEmail,
        },
      ],
      { onConflict: ["email"] } 
    );

    if (insertError) {
      toast.error("Failed to save guest data: " + insertError.message);
      console.error("Supabase Table error:", insertError);
      return;
    }

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: guestEmail,
      password: guestPassword,
    });

    if (loginError || !loginData.user) {
      toast.error("Guest login failed: please try again.");
      console.error("Supabase login error:", loginError);
      return;
    }

    const guestUser = {
      id: userId,
      email: guestEmail,
      last_name: "Guest",
      role: "guest",
    };
    localStorage.setItem("user", JSON.stringify(guestUser));

    navigate("/menu");
    toast.success("Logged in as Guest!");
  } catch (err) {
    console.error(err);
    toast.error("Guest login error");
  }
};


  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ last_name: "", role: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-[#C7AD7F] flex justify-center items-start p-4 sm:p-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
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

              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full pl-11 py-3 border outline-none"
                >
                  <option value="">Select Role</option>
                  {allowedRoles.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
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
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-12 text-center text-sm text-black">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={toggleForm} className="font-semibold hover:underline">
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full text-black border py-3 text-xl font-semibold transition hover:-translate-y-1 hover:shadow-xl"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
