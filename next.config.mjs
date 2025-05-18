/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: false,
  output: "export",
  basePath: isProd ? "/hcapdata-charts" : "",
  assetPrefix: isProd ? "/hcapdata-charts/" : "",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/hcapdata-charts" : "",
  },
};

export default nextConfig;
