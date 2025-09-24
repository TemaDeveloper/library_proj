import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb'
    }
  },
  images: {
    remotePatterns: [
       {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/images/**',
      }, 
      {
        protocol: 'https',
        hostname: 'www.gutenberg.org',
      },
      // ,
      // {
      //   protocol: 'https',
      //   hostname: 's3.ap-south-1.amazonaws.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'honya-books.s3.ap-south-1.amazonaws.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'img.freepik.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'i.pinimg.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'wallpapers.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 's3.ap-south-1.amazonaws.com',
      // }
    ]
  }
};

export default nextConfig;
