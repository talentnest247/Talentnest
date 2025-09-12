/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-popover',
      '@floating-ui/react'
    ],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Better Fast Refresh and development performance
    workerThreads: false,
    esmExternals: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  
  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      }
      
      // Better Fast Refresh and HMR
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      }
      
      // Reduce bundle size warnings
      config.performance = {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      }
    }
    
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
      net: false,
      tls: false,
    }

    // Better module resolution for floating-ui and radix
    config.resolve.alias = {
      ...config.resolve.alias,
      '@floating-ui/core': '@floating-ui/core',
      '@floating-ui/react': '@floating-ui/react',
      '@floating-ui/react-dom': '@floating-ui/react-dom'
    }

    return config
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },

  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Compression
  compress: true,

  // Performance optimizations
  poweredByHeader: false,
  generateEtags: false,

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // ESLint and TypeScript configurations
  eslint: {
    ignoreDuringBuilds: true, // Added from updates
  },
  typescript: {
    ignoreBuildErrors: true, // Added from updates
  },
}

export default nextConfig
