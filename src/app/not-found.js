// src/app/not-found.js
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-6xl font-bold mb-4 text-orange-500">404</h1>
      <p className="text-xl mb-8 text-orange-500">
        Oops! This page could not be found.
      </p>
      <Link href="/" className="text-red-500 italic underline mouser-pointer">
        Return to Homepage
      </Link>
    </div>
  );
}
