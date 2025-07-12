import requests

def test_health_check():
    # Replace '/health' with a real endpoint from your API
    response = requests.get("http://localhost:8080/health")
    assert response.status_code == 200
    # You can add more assertions based on your API's response
