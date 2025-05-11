"use client";
import React from "react";
import { useRouter } from "next/navigation"; // if you are using Next.js

function Navbar() {
  const router = useRouter();
  return (
    <header className="flex justify-between items-center p-5 mb-2 shadow-lg bg-gray-200">
      <p
        onClick={() => router.push("/")}
        className="text-3xl font-bold text-gray-800 hover:text-blue-600 cursor-pointer transition"
      >
        HCAP Statistics
      </p>
      <nav className="space-x-4">
        <button
          onClick={() => router.push("/about")}
          className="text-gray-600 hover:text-blue-600 font-medium cursor-pointer transition"
        >
          About
        </button>
        {/* <button
          onClick={() => router.push("/contact")}
          className="text-gray-600 hover:text-blue-600 font-medium cursor-pointer transition"
        >
          Contact
        </button> */}
      </nav>
    </header>
  );
}

export default Navbar;
