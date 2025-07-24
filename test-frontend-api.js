// Test script to verify frontend API client functionality
console.log('Testing Frontend API Client...');

// Test the environment configuration
console.log('Environment:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  Current_URL: window.location.href
});

// Import the authAPI
import { authAPI } from './src/lib/neondb.js';

// Test function
async function testFrontendAPI() {
  try {
    console.log('1. Testing API client initialization...');
    
    // Test health endpoint (if available)
    try {
      const healthResponse = await fetch('http://localhost:3001/health');
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('✅ Backend health check:', healthData.message);
      }
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
    }

    // Test authentication endpoints
    console.log('2. Testing authentication...');
    
    const testUser = {
      name: 'Frontend Test User',
      email: `frontend.test.${Date.now()}@example.com`,
      password: 'testpass123'
    };

    try {
      // Try signup
      const signupResult = await authAPI.signUp(testUser.email, testUser.password, { name: testUser.name });
      console.log('✅ Signup successful:', signupResult.message);
      
      // Test save analysis
      console.log('3. Testing analysis save...');
      const testAnalysis = {
        document_name: 'Frontend Test Document.pdf',
        document_type: 'application/pdf',
        industry: 'healthcare',
        frameworks: ['HIPAA'],
        analysis_results: {
          overallCompliance: 85,
          gaps: [
            {
              category: 'Data Security',
              severity: 'Medium',
              description: 'Test gap for frontend verification'
            }
          ]
        },
        gaps_found: 1,
        compliance_score: 85
      };

      const saveResult = await authAPI.saveAnalysis(testAnalysis);
      console.log('✅ Analysis save successful:', saveResult.message);

      // Test get history
      console.log('4. Testing history retrieval...');
      const historyResult = await authAPI.getAnalysisHistory();
      console.log('✅ History retrieval successful:', `Found ${historyResult.history.length} analyses`);

      console.log('🎉 All frontend API tests passed!');

    } catch (error) {
      console.log('❌ API test failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Test setup failed:', error);
  }
}

// Export for testing
window.testFrontendAPI = testFrontendAPI;

console.log('Frontend API test script loaded. Call testFrontendAPI() to run tests.');
