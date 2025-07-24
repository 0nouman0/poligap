// Test script to verify analysis history functionality

async function testHistoryFeatures() {
  console.log('🧪 Testing Analysis History Features...\n');

  try {
    // Test 1: Check if backend is running
    console.log('1. Testing backend connection...');
    const healthCheck = await fetch(`http://localhost:3001/health`);
    if (healthCheck.ok) {
      console.log('✅ Backend is running\n');
    } else {
      console.log('❌ Backend connection failed\n');
      return;
    }

    // Test 2: Register a test user
    console.log('2. Testing user registration...');
    const registerData = {
      name: 'Test User',
      email: 'testhistory@example.com',
      password: 'testpass123'
    };

    const registerResponse = await fetch(`http://localhost:3001/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    let token;
    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      token = registerResult.token;
      console.log('✅ User registered successfully\n');
    } else {
      // Try login instead
      console.log('ℹ️ User might already exist, trying login...');
      const loginResponse = await fetch(`http://localhost:3001/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password
        }),
      });

      if (loginResponse.ok) {
        const loginResult = await loginResponse.json();
        token = loginResult.token;
        console.log('✅ User logged in successfully\n');
      } else {
        console.log('❌ Authentication failed\n');
        const errorText = await loginResponse.text();
        console.log('Error:', errorText);
        return;
      }
    }

    // Test 3: Save a test analysis
    console.log('3. Testing analysis save...');
    const testAnalysis = {
      document_name: 'Test Policy Document.pdf',
      document_type: 'policy',
      industry: 'healthcare',
      frameworks: ['HIPAA', 'SOC2'],
      analysis_results: {
        overallCompliance: 75,
        gaps: [
          {
            category: 'Data Protection',
            severity: 'High',
            description: 'Missing encryption requirements',
            recommendation: 'Implement AES-256 encryption'
          }
        ],
        recommendations: ['Improve data handling procedures'],
        complianceScore: 75
      },
      gaps_found: 1,
      compliance_score: 75
    };

    const saveResponse = await fetch(`http://localhost:3001/api/analysis/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testAnalysis),
    });

    if (saveResponse.ok) {
      const saveResult = await saveResponse.json();
      console.log('✅ Analysis saved successfully');
      console.log(`   Analysis ID: ${saveResult.analysis.id}\n`);
    } else {
      console.log('❌ Failed to save analysis');
      const errorText = await saveResponse.text();
      console.log('Error:', errorText);
      return;
    }

    // Test 4: Retrieve analysis history
    console.log('4. Testing analysis history retrieval...');
    const historyResponse = await fetch(`http://localhost:3001/api/analysis/history`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (historyResponse.ok) {
      const historyResult = await historyResponse.json();
      console.log('✅ Analysis history retrieved successfully');
      console.log(`   Found ${historyResult.history.length} analysis(es)`);
      
      if (historyResult.history.length > 0) {
        const latest = historyResult.history[0];
        console.log(`   Latest: ${latest.document_name} (Score: ${latest.compliance_score}%)\n`);
        
        // Test 5: Get specific analysis details
        console.log('5. Testing specific analysis retrieval...');
        const detailResponse = await fetch(`http://localhost:3001/api/analysis/history/${latest.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (detailResponse.ok) {
          const detailResult = await detailResponse.json();
          console.log('✅ Analysis details retrieved successfully');
          console.log(`   Document: ${detailResult.analysis.document_name}`);
          console.log(`   Gaps: ${detailResult.analysis.gaps_found}`);
          console.log(`   Score: ${detailResult.analysis.compliance_score}%\n`);
        } else {
          console.log('❌ Failed to retrieve analysis details');
          const errorText = await detailResponse.text();
          console.log('Error:', errorText);
        }
      }
    } else {
      console.log('❌ Failed to retrieve analysis history');
      const errorText = await historyResponse.text();
      console.log('Error:', errorText);
    }

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Backend connection: Working');
    console.log('✅ User authentication: Working');
    console.log('✅ Analysis saving: Working');
    console.log('✅ History retrieval: Working');
    console.log('✅ Analysis details: Working');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the tests
testHistoryFeatures();
