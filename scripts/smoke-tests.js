// Run this script locally after starting the dev server:
// node scripts/smoke-tests.js

const BASE = process.env.BASE || 'http://localhost:3000'
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args))

async function run() {
  console.log('Running smoke tests against', BASE)

  // Providers list
  const pRes = await fetch(`${BASE}/api/providers`)
  console.log('/api/providers ->', pRes.status)

  // Reviews list
  const rRes = await fetch(`${BASE}/api/reviews`)
  console.log('/api/reviews ->', rRes.status)

  // Bookings (empty)
  const bRes = await fetch(`${BASE}/api/bookings`)
  console.log('/api/bookings ->', bRes.status)

  // Presign (should be 400 without body)
  const upRes = await fetch(`${BASE}/api/uploads/presign`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({}) })
  console.log('/api/uploads/presign ->', upRes.status)

  console.log('Smoke tests finished')
}

run().catch(e => { console.error('Smoke tests failed', e); process.exitCode = 1 })
