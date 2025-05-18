import React from "react";

const Spinner = () => {
  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-10 z-50 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-t-transparent border-red-500 rounded-full animate-spin animate-pulse-scale"></div>
      <div className="text-red-500 mt-4 text-lg font-semibold animate-pulse">Loading data ...</div>
    </div>
  );
};

export default Spinner;
