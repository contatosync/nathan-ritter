import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    VENDAS_BASE: process.env.VENDAS_BASE || "177",
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
