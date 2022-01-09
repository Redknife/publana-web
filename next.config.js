/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')([
  '@solana/wallet-adapter-base',
  '@solana/wallet-adapter-react',
  '@solana/wallet-adapter-react-ui',
]);

module.exports = withTM({
  reactStrictMode: true,
});
