#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up development environment...')

// Environment check
const nodeVersion = process.version
console.log(`📋 Node.js version: ${nodeVersion}`)

try {
  // Clean cache directories safely
  const cacheDirs = [
    '.next',
    'node_modules/.cache',
    '.turbo'
  ]

  cacheDirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir)
    if (fs.existsSync(dirPath)) {
      console.log(`🧹 Cleaning ${dir}...`)
      try {
        // Use safer recursive removal
        fs.rmSync(dirPath, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 })
        console.log(`✅ Cleaned ${dir}`)
      } catch (error) {
        console.warn(`⚠️  Warning: Could not clean ${dir}:`, error.message)
      }
    }
  })

  // Ensure directories exist
  const requiredDirs = [
    'public/uploads',
    'public/temp',
    'components/ui',
    'lib/supabase'
  ]

  requiredDirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir)
    if (!fs.existsSync(dirPath)) {
      console.log(`📁 Creating ${dir}...`)
      fs.mkdirSync(dirPath, { recursive: true })
      console.log(`✅ Created ${dir}`)
    }
  })

  // Create gitkeep files for empty directories
  const emptyDirs = ['public/uploads', 'public/temp']
  emptyDirs.forEach(dir => {
    const gitkeepPath = path.join(process.cwd(), dir, '.gitkeep')
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, '# This file keeps the directory in git\n')
      console.log(`📝 Created .gitkeep in ${dir}`)
    }
  })

  // Check critical files exist
  const criticalFiles = [
    'package.json',
    'next.config.mjs',
    '.env.local'
  ]

  let missingFiles = []
  criticalFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file)
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file)
    }
  })

  if (missingFiles.length > 0) {
    console.warn(`⚠️  Warning: Missing critical files: ${missingFiles.join(', ')}`)
  }

  // Optimize environment variables
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8')
    
    // Add development optimizations if not present
    if (!envContent.includes('NODE_ENV=development')) {
      envContent += '\n# Development optimizations\nNODE_ENV=development\n'
    }
    if (!envContent.includes('FAST_REFRESH=true')) {
      envContent += 'FAST_REFRESH=true\n'
    }
    if (!envContent.includes('WEBPACK_DISABLE_GZIP=true')) {
      envContent += 'WEBPACK_DISABLE_GZIP=true\n'
    }
    
    fs.writeFileSync(envPath, envContent)
    console.log('🔧 Optimized environment variables')
  }

  console.log('✅ Development environment setup complete!')
  console.log('🎯 Ready to start development server')
  
} catch (error) {
  console.error('❌ Development setup failed:', error.message)
  console.error('Stack trace:', error.stack)
  process.exit(1)
}
