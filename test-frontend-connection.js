// Simple frontend connectivity test
async function testFrontendBackendConnection() {
  console.log('🔗 Testing Frontend-Backend Connection...\n');

  // Test 1: Check environment variables
  console.log('Environment Configuration:');
  console.log('- API URL:', import.meta.env.VITE_API_URL || 'http://localhost:3001');
  console.log('- Database URL:', import.meta.env.DATABASE_URL ? 'configured' : 'not configured');
  console.log('- Gemini API Key:', import.meta.env.VITE_GEMINI_API_KEY ? 'configured' : 'not configured');
  console.log('');

  // Test 2: Health check
  try {
    console.log('Testing backend health endpoint...');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/health`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend health check successful:', data.message);
    } else {
      console.log('❌ Backend health check failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }

  console.log('\n🎉 Test completed!');
}

// Run the test
testFrontendBackendConnection();
