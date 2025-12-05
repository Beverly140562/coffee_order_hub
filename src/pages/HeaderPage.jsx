import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import { supabase } from "../config/supabase";

export default function HeaderPage() {
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
  const fetchUserName = async () => {
    try {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        const { data: userData, error } = await supabase
          .from("users")
          .select("last_name")
          .eq("id", data.user.id)
          .maybeSingle(); 

        if (error) {
          console.error("Error fetching user data:", error.message);
        }

        if (userData?.last_name) {
          setUserName(userData.last_name);
        }
      } else {
        setUserName("Guest");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setUserName("Guest");
    }
  };

  fetchUserName();
}, []);

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Hi, Good Morning";
  if (hour < 18) return "Hi, Good Afternoon";
  return "Hi, Good Evening";
};



  return (
    <div className="flex justify-between items-center p-5">
      <div>
        <h1 className="text-2xl font-bold text-black pt-10">
          {getGreeting()}
        </h1>
        <p className="text-lg text-black mt-3">
          Good ideas start with coffee.
        </p>
      </div>

      <img
        src={Logo}
        alt="Logo"
        className="w-32 h-32 object-cover"
      />
    </div>
  );
}
