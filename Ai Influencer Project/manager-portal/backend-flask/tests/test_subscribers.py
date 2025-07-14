import requests
from utils import generate_random_username, generate_random_phone_number

global subscriber_id, test_username, phone_number

subscriber_id = 1

def test_add_subscriber():
    """
    Test the POST /subscribers endpoint to add a new subscriber.
    """
    test_username = generate_random_username()
    phone_number = generate_random_phone_number()
    payload = {
        "username": test_username,
        "name": "Test",
        "lastname": "User",
        "phonenumber": phone_number,
        "country": "Testland",
        "primary_language": "English",
        "notes": "pytest subscriber"
    }
    response = requests.post("http://localhost:5000/subscribers", json=payload)
    assert response.status_code == 201, f"Unexpected status code: {response.status_code}"
    data = response.json()
    assert 'message' in data and 'subscriber_id' in data
    subscriber_id = data['subscriber_id']

def test_delete_subscriber():
    """
    Test the DELETE /subscribers/<subscriber_id> endpoint to remove a subscriber.
    This test deletes the subscriber created in test_add_subscriber.
    """
    delete_url = f"http://localhost:5000/subscribers/{subscriber_id}"
    delete_response = requests.delete(delete_url)
    assert delete_response.status_code in (200, 404), f"Unexpected status code: {delete_response.status_code}"
    delete_data = delete_response.json()
    if delete_response.status_code == 200:
        assert 'message' in delete_data, "No message returned from delete"
    else:
        assert 'error' in delete_data, "No error message returned from delete"

def test_get_subscribers():
    """
    Test the GET /subscribers endpoint to retrieve a list of subscribers.
    Returns 200 and a list (possibly empty).
    """
    url = "http://localhost:5000/subscribers"
    response = requests.get(url)
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
    data = response.json()
    assert isinstance(data, list), "Response should be a list"
    if data:
        expected_keys = {"id_sub", "username", "name"}
        assert expected_keys.issubset(data[0].keys()), f"Missing expected keys in response: {expected_keys - set(data[0].keys())}"


def test_get_subscriber():
    """
    Test the GET /subscribers/<subscriber_id> endpoint to retrieve a single subscriber.
    This test assumes a subscriber with ID 1 exists.
    """
    subscriber_id = 1
    url = f"http://localhost:5000/subscribers/{subscriber_id}"
    response = requests.get(url)
    assert response.status_code in (200, 404), f"Unexpected status code: {response.status_code}"
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data, dict), "Response should be a JSON object"
        expected_keys = {"id_sub", "username", "name"}
        assert expected_keys.issubset(data.keys()), f"Missing expected keys in response: {expected_keys - set(data.keys())}"


# def test_get_subscribers_recent_activity():
#     """
#     Test the GET /subscribers/recent-activity endpoint to retrieve recent activity for subscribers.
#     Returns 200 and either a list or a message if no messages exist.
#     """
#     url = "http://localhost:8080/subscribers/recent-activity"
#     response = requests.get(url)
#     assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
#     data = response.json()
#     if isinstance(data, list):
#         if data:
#             expected_keys = {"id_sub", "username", "name"}
#             assert expected_keys.issubset(data[0].keys()), f"Missing expected keys in response: {expected_keys - set(data[0].keys())}"
#     elif isinstance(data, dict) and data.get("message") == "No messages":
#         assert True  # Acceptable response when no messages exist
#     else:
#         assert False, f"Unexpected response format: {data}"
