import requests

BASE_URL = "http://localhost:5000"

def test_dashboard_recent_chats():
    response = requests.get(f"{BASE_URL}/dashboard/recent-chats")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_dashboard_newest_subscribers():
    response = requests.get(f"{BASE_URL}/dashboard/newest-subscribers")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_dashboard_recent_unread_messages():
    response = requests.get(f"{BASE_URL}/dashboard/recent-unread-messages")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_dashboard_current_mood():
    response = requests.get(f"{BASE_URL}/dashboard/current-mood")
    # 200 if data, 404 if no data
    assert response.status_code in (200, 404)
    if response.status_code == 200:
        data = response.json()
        assert "current_mood" in data
        assert "timestamp" in data
    else:
        assert "error" in response.json()


def test_dashboard_total_subscribers():
    response = requests.get(f"{BASE_URL}/dashboard/total-subscribers")
    assert response.status_code == 200
    data = response.json()
    assert "total_subscribers" in data
    assert isinstance(data["total_subscribers"], int)


def test_dashboard_new_subscribers_today():
    response = requests.get(f"{BASE_URL}/dashboard/new-subscribers-today")
    assert response.status_code == 200
    data = response.json()
    assert "new_subscribers_last_24hrs" in data
    assert isinstance(data["new_subscribers_last_24hrs"], int) 