import requests

BASE_URL = "http://localhost:5000"

def test_health_check():
    response = requests.get(f"{BASE_URL}/")
    assert response.status_code == 200
