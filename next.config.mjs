/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: false,
  output: "export",
  basePath: isProd ? "/data-growthfund-charts" : "",
  assetPrefix: isProd ? "/data-growthfund-charts/" : "",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/data-growthfund-charts" : "",
  },
};

export default nextConfig;
