#!/usr/bin/env node

/**
 * Database Management Script for Unilorin Artisan Platform
 * This script helps you set up and manage your Supabase database
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })
require('dotenv').config() // Also load from .env if it exists

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please check your .env file for:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkConnection() {
  console.log('🔍 Checking database connection...')
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact' })
      .limit(1)

    if (error) throw error
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

async function getTableStats() {
  console.log('\n📊 Getting database statistics...')
  try {
    const tables = ['users', 'providers', 'categories', 'skills', 'enrollments']
    
    for (const table of tables) {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(0)

      if (error) {
        console.log(`   ${table}: Error - ${error.message}`)
      } else {
        console.log(`   ${table}: ${count || 0} records`)
      }
    }
  } catch (error) {
    console.error('Error getting statistics:', error.message)
  }
}

async function seedDatabase() {
  console.log('\n🌱 Seeding database with sample data...')
  
  try {
    const seedFile = path.join(__dirname, 'seed-database.sql')
    if (!fs.existsSync(seedFile)) {
      console.error('❌ Seed file not found:', seedFile)
      return false
    }

    const seedSQL = fs.readFileSync(seedFile, 'utf8')
    
    // Split by statement and execute each one
    const statements = seedSQL.split(';').filter(stmt => stmt.trim())
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() + ';' })
        if (error) {
          console.log(`   Warning: ${error.message}`)
        }
      }
    }
    
    console.log('✅ Database seeding completed')
    return true
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    return false
  }
}

async function testQueries() {
  console.log('\n🧪 Testing database queries...')
  
  try {
    // Test providers query
    const { data: providers, error: providerError } = await supabase
      .from('providers')
      .select(`
        *,
        users!inner(first_name, last_name, full_name)
      `)
      .eq('verification_status', 'approved')
      .limit(3)

    if (providerError) throw providerError
    console.log(`   ✅ Providers query: Found ${providers.length} approved providers`)

    // Test categories query
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .limit(5)

    if (categoryError) throw categoryError
    console.log(`   ✅ Categories query: Found ${categories.length} categories`)

    // Test skills query
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('*')
      .limit(3)

    if (skillsError) throw skillsError
    console.log(`   ✅ Skills query: Found ${skills.length} skills`)

    return true
  } catch (error) {
    console.error('❌ Query test failed:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Unilorin Artisan Platform - Database Management')
  console.log('================================================\n')

  const isConnected = await checkConnection()
  if (!isConnected) {
    console.log('\n💡 Next steps:')
    console.log('1. Check your Supabase project settings')
    console.log('2. Verify your environment variables in .env')
    console.log('3. Make sure your database schema is set up')
    return
  }

  await getTableStats()

  // Check if we need to seed the database
  const { data: existingUsers } = await supabase
    .from('users')
    .select('count', { count: 'exact' })
    .eq('role', 'artisan')

  if (!existingUsers || existingUsers.length === 0) {
    console.log('\n📝 Database appears to be empty. Would you like to seed it with sample data?')
    console.log('   (This will add categories, sample artisans, and skills)')
    
    // For now, auto-seed if empty
    await seedDatabase()
    await getTableStats()
  }

  await testQueries()

  console.log('\n🎉 Database is ready for use!')
  console.log('\n💡 Your marketplace will now load data from Supabase instead of mock data.')
  console.log('   Visit your marketplace to see the real data in action.')
}

// Handle command line arguments
const command = process.argv[2]

if (command === 'seed') {
  seedDatabase().then(() => process.exit(0))
} else if (command === 'stats') {
  checkConnection().then(connected => {
    if (connected) getTableStats().then(() => process.exit(0))
    else process.exit(1)
  })
} else if (command === 'test') {
  checkConnection().then(connected => {
    if (connected) testQueries().then(() => process.exit(0))
    else process.exit(1)
  })
} else {
  main().then(() => process.exit(0))
}
