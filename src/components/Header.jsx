


import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLogOut } from "react-icons/fi";
import TaikishaLogo from "../assets/Taikishaimage1.png";

export default function Header() {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("loggedInUser") || "Guest";

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/animation", { replace: true });
  };

  return (
    <header className="relative w-full bg-gradient-to-r from-sky-100 via-sky-600 to-sky-700 text-white shadow-xl px-4 sm:px-8 md:px-16 py-3 sm:py-4 flex justify-between items-center">
      
      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-4">
        <img
          src={TaikishaLogo}
          alt="logo"
          className="h-8 sm:h-10 md:h-12 w-auto object-contain drop-shadow-lg"
        />
      </div>

      {/* Center Title - Beautiful Text */}
      <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none text-center">
        <h1 className="font-black text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-wider whitespace-nowrap drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
          Taikisha{" "}
          <span className="relative inline-block">
            Map Editor
          </span>{" "}
          Tool
        </h1>
      </div>

      {/* User / Logout - Sleek Design */}
      <div className="relative">
        <button
          onClick={handleLogout}
          className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-md flex items-center gap-2 transition-all duration-300 border border-white/20 hover:shadow-lg hover:scale-105"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-md">
            <FiUser size={14} className="text-gray-800" />
          </div>
          <span className="hidden lg:inline font-semibold text-sm">{loggedInUser}</span>
          <div className="w-px h-4 bg-white/30 hidden lg:block"></div>
          <FiLogOut size={14} className="hover:rotate-12 transition-transform duration-300" />
        </button>
      </div>

    </header>
  );
}