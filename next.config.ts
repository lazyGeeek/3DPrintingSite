import type { NextConfig } from "next";

const isExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',        // Enables static export to `out/`
  distDir: '.next',        // Default; keep unless you changed it
  images: {
    unoptimized: true,     // Required for GitHub Pages (no Next.js Image optimizer)
  },
  ...(isExport ? { output: "export" } : {}),
  ...(isExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                {
                  key: "X-Robots-Tag",
                  value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
