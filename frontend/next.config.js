/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  env: {
    NEXT_PUBLIC_API_URL: "https://collegediscoveryplatform-gxs5.onrender.com",
  },
};

module.exports = nextConfig;
