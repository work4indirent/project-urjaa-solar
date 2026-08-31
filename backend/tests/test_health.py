"""Regression tests for the scaffold health/status API."""
import os

import pytest
import requests


BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")


@pytest.fixture(scope="module")
def api():
    if not BASE_URL:
        pytest.skip("REACT_APP_BACKEND_URL is not configured")
    return requests.Session()


def test_api_root(api):
    response = api.get(f"{BASE_URL}/api/", timeout=10)
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}


def test_status_create_returns_valid_record(api):
    response = api.post(f"{BASE_URL}/api/status", json={"client_name": "TEST_health"}, timeout=10)
    assert response.status_code == 200
    data = response.json()
    assert data["client_name"] == "TEST_health"
    assert isinstance(data["id"], str)
    assert "timestamp" in data


def test_status_list_returns_records_without_mongo_id(api):
    response = api.get(f"{BASE_URL}/api/status", timeout=10)
    assert response.status_code == 200
    records = response.json()
    assert isinstance(records, list)
    assert all("_id" not in record for record in records)