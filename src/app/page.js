"use client";
// HomePage.tsx

import { useRouter } from "next/navigation"; // if you are using Next.js
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-[90vh] bg-gray-50 flex flex-col">
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <Image
          width={256}
          height={256}
          src="/data_visualization.png" // Example, you can replace it
          alt="Data Visualization"
          className="w-64 h-64 mb-6"
        />
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Explore Data from HCAP
        </h2>
        <p className="text-gray-600 max-w-xl mb-8">
          Dive into visual insights powered by the official{" "}
          <a
            href="https://data.hcap.gr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 italic hover:underline"
          >
            data.hcap.gr
          </a>{" "}
          platform. Choose a category to explore statistics in a clean and
          interactive way.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => router.push("/epikiroseis")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Επικυρώσεις (2019 - 2023)
          </button>
          {/* <button
            // onClick={() => router.push("/charts/investments")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Investments Charts
          </button>
          <button
            // onClick={() => router.push("/charts/performance")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Performance Charts
          </button> */}
        </div>
      </div>
    </div>
  );
}
