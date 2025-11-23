/**
 * API Test Script for PortFlow Frontend
 * Run this in the browser console to test all API endpoints
 */

const API_URL = 'https://22aac83d5243.ngrok-free.app';
const HEADERS = {
  'ngrok-skip-browser-warning': 'true',
  'Content-Type': 'application/json'
};

console.log('🚀 PortFlow API Test Suite Starting...\n');

// Test 1: List all containers
async function testListContainers() {
  console.log('📦 Test 1: List All Containers');
  try {
    const response = await fetch(`${API_URL}/api/containers`, { headers: HEADERS });
    const data = await response.json();
    console.log('✅ Success:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed:', error);
    throw error;
  }
}

// Test 2: Get specific container
async function testGetContainer(containerId = 'MAEU1234567') {
  console.log(`\n📋 Test 2: Get Container ${containerId}`);
  try {
    const response = await fetch(`${API_URL}/api/containers/${containerId}`, { headers: HEADERS });
    const data = await response.json();
    console.log('✅ Success:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed:', error);
    throw error;
  }
}

// Test 3: Check customs status
async function testCustomsStatus(containerId = 'MAEU1234567') {
  console.log(`\n💰 Test 3: Customs Status for ${containerId}`);
  try {
    const response = await fetch(`${API_URL}/api/customs/status/${containerId}`, { headers: HEADERS });
    const data = await response.json();
    console.log('✅ Success:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed:', error);
    throw error;
  }
}

// Test 4: Get shipping status
async function testShippingStatus(containerId = 'MAEU1234567') {
  console.log(`\n🚢 Test 4: Shipping Status for ${containerId}`);
  try {
    const response = await fetch(`${API_URL}/api/shipping/status/${containerId}`, { headers: HEADERS });
    const data = await response.json();
    console.log('✅ Success:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed:', error);
    throw error;
  }
}

// Test 5: Get watsonx config
async function testWatsonxConfig() {
  console.log('\n🤖 Test 5: watsonx Configuration');
  try {
    const response = await fetch(`${API_URL}/api/watsonx/config`, { headers: HEADERS });
    const data = await response.json();
    console.log('✅ Success:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed:', error);
    throw error;
  }
}

// Test 6: Get watsonx token
async function testWatsonxToken() {
  console.log('\n🔐 Test 6: watsonx Authentication Token');
  try {
    const response = await fetch(`${API_URL}/api/watsonx/token`, { headers: HEADERS });
    const data = await response.json();
    console.log('✅ Success:', {
      token: data.token ? `${data.token.substring(0, 20)}...` : 'N/A',
      expires_in: data.expires_in,
      session_id: data.session_id
    });
    return data;
  } catch (error) {
    console.error('❌ Failed:', error);
    throw error;
  }
}

// Run all tests
async function runAllTests() {
  console.log('═══════════════════════════════════════');
  console.log('   PortFlow API Integration Tests');
  console.log('═══════════════════════════════════════\n');
  
  const results = {
    passed: 0,
    failed: 0,
    total: 6
  };

  const tests = [
    testListContainers,
    testGetContainer,
    testCustomsStatus,
    testShippingStatus,
    testWatsonxConfig,
    testWatsonxToken
  ];

  for (const test of tests) {
    try {
      await test();
      results.passed++;
    } catch {
      results.failed++;
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('📊 Test Results Summary');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Passed: ${results.passed}/${results.total}`);
  console.log(`❌ Failed: ${results.failed}/${results.total}`);
  console.log('═══════════════════════════════════════\n');

  if (results.failed === 0) {
    console.log('🎉 All tests passed! Integration is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
}

// Export test functions for manual use
window.portflowTests = {
  runAllTests,
  testListContainers,
  testGetContainer,
  testCustomsStatus,
  testShippingStatus,
  testWatsonxConfig,
  testWatsonxToken
};

console.log('✨ Test suite loaded!');
console.log('Run: portflowTests.runAllTests() to test all endpoints');
console.log('Or run individual tests like: portflowTests.testGetContainer()');
