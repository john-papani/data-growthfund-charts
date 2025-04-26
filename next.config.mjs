/** @type {import('next').NextConfig} */
const isProd = process.env.NEXT_PUBLIC_ENVIRONMENT === "PRODUCTION";

const nextConfig = {
  reactStrictMode: false,
  output: "export",
  basePath: isProd ? "/hcapdata-charts" : "",
  assetPrefix: isProd ? "/hcapdata-charts/" : "", 
};

export default nextConfig;
