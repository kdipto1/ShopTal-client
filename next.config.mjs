/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;

// Config for bundle analyze

// import withBundleAnalyzer from "@next/bundle-analyzer";

// const nextConfig = withBundleAnalyzer({
//   enabled: process.env.ANALYZE === "true",
// });

// export default nextConfig;
