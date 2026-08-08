import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',        // Enables static export to `out/`
  // distDir: '.next',        // Default; keep unless you changed it
  images: {
    unoptimized: true,     // Required for GitHub Pages (no Next.js Image optimizer)
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'X-Robots-Tag',
  //           value: 'noindex, nofollow, noarchive, nosnippet, noimageindex',
  //         },
  //       ],
  //     },
  //   ]
  // },
};

export default nextConfig;
