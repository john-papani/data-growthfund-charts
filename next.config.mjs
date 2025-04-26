/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  basePath: isProd ? "/hcapdata-charts" : "",
  assetPrefix: isProd ? "/hcapdata-charts/" : "",
  images: {
    unoptimized: true,
    // GitHub Pages does not support Next.js image optimization
  },
};
