/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    //  Add global styles you want module sass files to access
    additionalData: `@import "src/styles/sass/abstracts/variables.scss";`,
  },
  typescript: {
    // ignoreBuildErrors: true
  },
  images: {
    domains: [
      'plus.unsplash.com',
      'images.unsplash.com',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'encrypted-tbn0.gstatic.com',
    ],
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value:
              process.env.NODE_ENV === 'production'
                ? 'https://localinspire.vercel.app'
                : 'http://192.168.93.12:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:path',
        destination: 'https://local-inspire-backend.onrender.com/api/v1/:path',
      },
    ];
  },
};

module.exports = nextConfig;
