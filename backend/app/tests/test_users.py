from fastapi.testclient import TestClient

def test_register_user(client: TestClient):
    response = client.post(
        "/api/v1/users/register",
        json={"email": "newuser@example.com", "password": "newpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data

def test_login(client: TestClient, test_user):
    _, user_data = test_user
    response = client.post(
        "/api/v1/users/login",
        data={"username": user_data["email"], "password": user_data["password"]},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_get_me(client: TestClient, user_token_headers):
    response = client.get("/api/v1/users/me", headers=user_token_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
