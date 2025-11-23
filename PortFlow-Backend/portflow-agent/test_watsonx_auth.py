"""
Test watsonx authentication endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_config_endpoint():
    """Test /api/watsonx/config"""
    print("Testing /api/watsonx/config...")
    try:
        response = requests.get(f"{BASE_URL}/api/watsonx/config")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_token_endpoint():
    """Test /api/watsonx/token"""
    print("\nTesting /api/watsonx/token...")
    try:
        response = requests.get(f"{BASE_URL}/api/watsonx/token")
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        # Verify token structure
        required_fields = ['token', 'session_id', 'orchestration_id', 'agent_id', 'host_url', 'expires_in']
        missing = [f for f in required_fields if f not in data]
        if missing:
            print(f"❌ Missing fields: {missing}")
            return False
        
        print("✅ Token structure valid")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_ngrok_endpoints():
    """Test through ngrok"""
    ngrok_url = "https://a81732fd9347.ngrok-free.app"
    headers = {'ngrok-skip-browser-warning': 'true'}
    
    print(f"\nTesting through ngrok: {ngrok_url}...")
    
    # Test config
    try:
        response = requests.get(f"{ngrok_url}/api/watsonx/config", headers=headers)
        print(f"Config Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Config endpoint accessible via ngrok")
    except Exception as e:
        print(f"❌ Config error: {e}")
    
    # Test token
    try:
        response = requests.get(f"{ngrok_url}/api/watsonx/token", headers=headers)
        print(f"Token Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Token endpoint accessible via ngrok")
    except Exception as e:
        print(f"❌ Token error: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("watsonx Authentication Endpoints Test")
    print("=" * 60)
    
    # Test local endpoints
    config_ok = test_config_endpoint()
    token_ok = test_token_endpoint()
    
    # Test ngrok
    test_ngrok_endpoints()
    
    print("\n" + "=" * 60)
    if config_ok and token_ok:
        print("✅ All tests passed!")
        print("\nFrontend can now use these endpoints:")
        print("  - GET /api/watsonx/config")
        print("  - GET /api/watsonx/token")
    else:
        print("❌ Some tests failed")
    print("=" * 60)
