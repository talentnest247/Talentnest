/**
 * TEST SCRIPT FOR PROVIDER APPROVAL SYSTEM
 * 
 * Run this in your browser console while on http://localhost:3000/admin/dashboard
 * to test if the API is returning provider data correctly.
 */

console.log('🔍 Testing Provider Approval System...\n');

// Test 1: Check if API returns providers with include_all_statuses flag
async function testProviderAPI() {
  console.log('📡 Test 1: Fetching providers with include_all_statuses=true');
  
  try {
    const response = await fetch('/api/providers?include_all_statuses=true');
    const data = await response.json();
    
    console.log('✅ API Response Status:', response.status);
    console.log('📦 Response Data:', data);
    
    if (data.providers) {
      console.log(`✅ Found ${data.providers.length} providers`);
      
      const pending = data.providers.filter(p => p.verification_status === 'pending');
      const approved = data.providers.filter(p => p.verification_status === 'approved');
      const rejected = data.providers.filter(p => p.verification_status === 'rejected');
      
      console.log(`   - Pending: ${pending.length}`);
      console.log(`   - Approved: ${approved.length}`);
      console.log(`   - Rejected: ${rejected.length}`);
      
      if (pending.length > 0) {
        console.log('\n⏳ Pending Providers:');
        pending.forEach(p => {
          console.log(`   - ${p.business_name} (${p.user?.email || 'No email'})`);
        });
      }
      
      if (data.providers.length === 0) {
        console.warn('⚠️  No providers found! Possible issues:');
        console.warn('   1. Database is empty (no registrations yet)');
        console.warn('   2. RLS policies blocking access');
        console.warn('   3. Service role key not configured');
      }
    } else {
      console.error('❌ No providers array in response');
    }
  } catch (error) {
    console.error('❌ API Test Failed:', error);
  }
  
  console.log('\n');
}

// Test 2: Check approved providers only (student view)
async function testApprovedProvidersAPI() {
  console.log('📡 Test 2: Fetching approved providers only');
  
  try {
    const response = await fetch('/api/providers/approved');
    const data = await response.json();
    
    console.log('✅ API Response Status:', response.status);
    console.log('📦 Approved Providers:', data.providers?.length || 0);
    
    if (data.providers && data.providers.length > 0) {
      console.log('✅ Approved providers visible to students:');
      data.providers.forEach(p => {
        console.log(`   - ${p.business_name}`);
      });
    } else {
      console.log('ℹ️  No approved providers yet (expected if all are pending)');
    }
  } catch (error) {
    console.error('❌ Approved API Test Failed:', error);
  }
  
  console.log('\n');
}

// Test 3: Check admin stats
async function testAdminStats() {
  console.log('📡 Test 3: Fetching admin stats');
  
  try {
    const response = await fetch('/api/admin/stats');
    const data = await response.json();
    
    console.log('✅ API Response Status:', response.status);
    console.log('📊 Admin Stats:', data);
  } catch (error) {
    console.error('❌ Stats API Test Failed:', error);
  }
  
  console.log('\n');
}

// Run all tests
(async () => {
  await testProviderAPI();
  await testApprovedProvidersAPI();
  await testAdminStats();
  
  console.log('✨ Tests complete!\n');
  console.log('💡 Next steps:');
  console.log('   1. If no providers found: Register a new artisan at /register');
  console.log('   2. If RLS error: Run FIX_PROVIDER_APPROVAL_SYSTEM.sql in Supabase');
  console.log('   3. If API error: Check terminal logs for backend errors');
  console.log('   4. Check .env.local has SUPABASE_SERVICE_ROLE_KEY set correctly');
})();
