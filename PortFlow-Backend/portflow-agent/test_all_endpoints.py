"""
Comprehensive endpoint testing for PortFlow API
Tests all endpoints through ngrok tunnel
"""
import requests
import json

NGROK_URL = "https://22aac83d5243.ngrok-free.app"
HEADERS = {'ngrok-skip-browser-warning': 'true'}

def print_section(title):
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)

def test_endpoint(name, method, endpoint, **kwargs):
    """Test a single endpoint"""
    url = f"{NGROK_URL}{endpoint}"
    print(f"\n🧪 Testing: {name}")
    print(f"   Method: {method}")
    print(f"   URL: {url}")
    
    try:
        if method == "GET":
            response = requests.get(url, headers=HEADERS, **kwargs)
        elif method == "POST":
            response = requests.post(url, headers=HEADERS, **kwargs)
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code < 400:
            print(f"   ✅ Success")
            try:
                data = response.json()
                print(f"   Response preview: {json.dumps(data, indent=2)[:200]}...")
                return data
            except:
                print(f"   Response: {response.text[:200]}")
                return response.text
        else:
            print(f"   ❌ Failed")
            print(f"   Error: {response.text[:200]}")
            return None
    except Exception as e:
        print(f"   ❌ Exception: {e}")
        return None

def main():
    print("=" * 70)
    print("  PORTFLOW API ENDPOINT TESTING")
    print("  ngrok URL: https://22aac83d5243.ngrok-free.app")
    print("=" * 70)
    
    # Test 1: OpenAPI Spec
    print_section("1. OpenAPI Specification")
    test_endpoint(
        "Get OpenAPI Schema",
        "GET",
        "/openapi.json"
    )
    
    # Test 2: watsonx Endpoints
    print_section("2. watsonx Orchestrate Integration")
    test_endpoint(
        "Get watsonx Config",
        "GET",
        "/api/watsonx/config"
    )
    
    test_endpoint(
        "Get watsonx Token",
        "GET",
        "/api/watsonx/token"
    )
    
    # Test 3: Container Operations
    print_section("3. Container Operations")
    
    # List containers
    containers_data = test_endpoint(
        "List All Containers",
        "GET",
        "/api/containers"
    )
    
    # Get specific container (MAEU1234567 from previous tests)
    container_data = test_endpoint(
        "Get Container Status",
        "GET",
        "/api/containers/MAEU1234567"
    )
    
    # Test 4: Customs Operations
    print_section("4. Customs Operations")
    
    test_endpoint(
        "Check Customs Status",
        "GET",
        "/api/customs/status/MAEU1234567"
    )
    
    # Test 5: Shipping Operations
    print_section("5. Shipping Operations")
    
    test_endpoint(
        "Check Shipping Status",
        "GET",
        "/api/shipping/status/MAEU1234567"
    )
    
    # Test 6: Validation
    print_section("6. Container Validation")
    
    test_endpoint(
        "Validate Container",
        "POST",
        "/api/validate",
        json={
            "container_id": "MAEU1234567",
            "force_revalidate": False
        }
    )
    
    # Test 7: Demo - Check if new containers exist
    print_section("7. Testing Other Sample Containers")
    
    for container_id in ["MAEU4567890", "MSCU7890123", "CMAU1234567"]:
        test_endpoint(
            f"Get Container {container_id}",
            "GET",
            f"/api/containers/{container_id}"
        )
    
    # Test 8: Payment endpoint
    print_section("8. Customs Payment (Simulation)")
    
    test_endpoint(
        "Pay Customs Duty",
        "POST",
        "/api/customs/pay",
        json={
            "container_id": "MAEU1234567",
            "amount": "150000.00",
            "payment_reference": "TEST-PAY-12345"
        }
    )
    
    # Summary
    print_section("TEST SUMMARY")
    print("\n✅ All endpoint tests completed!")
    print("\nNext steps:")
    print("  1. Update watsonx OpenAPI import with new URL")
    print("  2. Update frontend NEXT_PUBLIC_API_URL")
    print("  3. Test frontend integration")
    print("\nNew ngrok URL: https://22aac83d5243.ngrok-free.app")
    print("=" * 70)

if __name__ == "__main__":
    main()
