const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// 驗證必要的環境變數（缺了整個 app 無法運作，直接 fail fast）
// 註：NEXT_PUBLIC_COMMIT_HASH 與 NEXT_PUBLIC_BUILD_TIME 由 build script 注入，不在此檢查
const requiredEnvVars = ['NEXT_PUBLIC_API_BASE_URL']
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  transpilePackages: ['ahooks']
}

module.exports = withBundleAnalyzer(nextConfig)
