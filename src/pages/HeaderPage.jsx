import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router";
import { supabase } from "../config/supabase";

export default function HeaderPage() {
  const [userName, setUserName] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        navigate("/signup");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("first_name")
        .eq("id", user.id)
        .single();

      if (userError || !userData) {
        console.error("Failed to fetch user details:", userError?.message);
        setUserName("Guest");
        return;
      }

      setUserName(userData.first_name);
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-5xl font-bold text-black m-2 pt-10">
          Hi, {userName}
        </h1>
        <p className="text-lg text-black mt-3 pl-5">
          Good ideas start with coffee.
        </p>
      </div>
      <img src={Logo} alt="Logo" className="w-33 h-33 object-cover" />
    </div>
  );
}
