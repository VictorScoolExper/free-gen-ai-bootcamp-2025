import requests


def test_get_latest_mental_state():
    """
    Test the GET /mental-state/latest endpoint to retrieve the latest mental state.
    Returns 200 with data if present, or 404 if not found.
    Note we will later modify these test when front end is added
    """
    url = "http://localhost:5000/mental-state/latest"
    response = requests.get(url)
    assert response.status_code in (200, 404), f"Unexpected status code: {response.status_code}"
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data, dict), "Response should be a JSON object"
        # Check for expected keys
        expected_keys = {"timestamp", "current_mood"}
        assert expected_keys.issubset(data.keys()), f"Missing expected keys in response: {expected_keys - set(data.keys())}"


def test_add_mental_state():
    """
    Test the POST /mental-state endpoint to add a new mental state.
    """
    payload = {
        "current_mood": "happy",
        "focus_area": "work",
        "energy_level": 8,
        "confidence_level": 7,
        "current_activity": "coding",
        "recent_input_summary": "solved a bug",
        "processing_load": 2,
        "error_rate": 0,
        "notes": "feeling productive"
    }
    response = requests.post("http://localhost:5000/mental-state", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert 'message' in data and 'state_id' in data


def test_get_last_week_mental_state():
    """
    Test the GET /mental-state/last-week endpoint to retrieve all mental state records from the last 7 days.
    Returns 200 and a list (possibly empty).
    """
    url = "http://localhost:5000/mental-state/last-week"
    response = requests.get(url)
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
    data = response.json()
    assert isinstance(data, list), "Response should be a list"
    # If there are results, check for expected keys in the first item
    if data:
        expected_keys = {"timestamp", "current_mood"}
        assert expected_keys.issubset(data[0].keys()), f"Missing expected keys in response: {expected_keys - set(data[0].keys())}"
