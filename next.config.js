/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    //  Add global styles you want module sass files to access
    additionalData: `@import "src/styles/sass/abstracts/variables.scss";`,
  },
};

module.exports = nextConfig;
