/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.tradepigloball.co" }],
        destination: "https://tradepigloball.co/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
