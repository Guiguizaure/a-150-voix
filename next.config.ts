import type { NextConfig } from "next";

// Site 100 % statique (Cloudflare Pages) : export HTML, aucune fonction serveur.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
