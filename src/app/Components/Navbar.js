"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => pathname === path;

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu when navigating
  const navigate = (path) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <header className="bg-gray-200 shadow-lg p-5 mb-2 relative">
      <div className="flex justify-between items-center">
        <p
          onClick={() => navigate("/")}
          className="text-2xl italic font-bold text-gray-800 hover:text-blue-600 cursor-pointer transition"
        >
          Open Data Hub Charts
        </p>

        {/* Hamburger Button (visible on small screens only) */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center px-3 py-2 border rounded text-gray-700 border-gray-700 hover:text-blue-600 hover:border-blue-600 transition"
          aria-label="Toggle menu"
        >
          <svg
            className="fill-current h-6 w-6"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.3 5.71a1 1 0 010 1.41L13.41 12l4.89 4.88a1 1 0 11-1.41 1.42L12 13.41l-4.88 4.89a1 1 0 11-1.42-1.41L10.59 12 5.7 7.11a1 1 0 011.41-1.41L12 10.59l4.88-4.89a1 1 0 011.42 0z"
              />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor" // or "red", "#00ff00", etc.
                  strokeWidth="2"
                  strokeLinecap="round" // optional: round line ends
                />
              </svg>
            )}
          </svg>
        </button>

        {/* Nav buttons */}
        <nav
          className={`${
            isOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row md:items-center gap-4 
    absolute top-full left-0 w-full bg-gray-200 z-50 px-4 py-2 shadow-md 
    md:static md:bg-transparent md:shadow-none md:top-auto md:left-auto md:w-auto md:p-0 md:gap-4 border-t md:border-0 `}
        >
          <div className="flex flex-col md:flex-row  flex-wrap gap-3">
            <button
              onClick={() => navigate("/epikiroseis")}
              className={`text-sm font-medium rounded px-3 py-1 transition ${
                isActive("/epikiroseis")
                  ? "bg-blue-100 text-blue-700"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              Επικυρώσεις (2019 - 2023)
            </button>

            <button
              onClick={() => navigate("/diktyopolisis")}
              className={`text-sm font-medium rounded px-3 py-1 transition ${
                isActive("/diktyopolisis")
                  ? "bg-green-100 text-green-700"
                  : "text-green-600 hover:bg-green-50"
              }`}
            >
              Δίκτυο Πώλησης (Χάρτης)
            </button>

            <button
              onClick={() => navigate("/anelkistireshsap")}
              className={`text-sm font-medium rounded px-3 py-1 transition ${
                isActive("/anelkistireshsap")
                  ? "bg-purple-100 text-purple-700"
                  : "text-purple-600 hover:bg-purple-50"
              }`}
            >
              Διευθυνσεις Ανελκυστήρων ΗΣΑΠ (Χάρτης)
            </button>

            <button
              onClick={() => navigate("/about")}
              className="text-gray-600 hover:text-blue-600 font-medium cursor-pointer transition text-sm"
            >
              About
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
