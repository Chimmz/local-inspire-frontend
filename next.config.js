/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    //  Add global styles you want module sass files to access
    additionalData: `@import "src/styles/sass/abstracts/variables.scss";`,
  },
  images: {
    domains: ['plus.unsplash.com', 'images.unsplash.com'],
  },
};

module.exports = nextConfig;
