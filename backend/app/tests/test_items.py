from fastapi.testclient import TestClient

def test_create_item(client: TestClient, user_token_headers):
    response = client.post(
        "/api/v1/items/",
        headers=user_token_headers,
        json={"title": "Test Item", "description": "This is a test item"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Item"
    assert data["description"] == "This is a test item"
    assert "id" in data

def test_get_items(client: TestClient, user_token_headers):
    # Create an item first
    client.post(
        "/api/v1/items/",
        headers=user_token_headers,
        json={"title": "List Item", "description": "Item to be listed"}
    )
    
    response = client.get("/api/v1/items/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(item["title"] == "List Item" for item in data)

def test_get_item_by_id(client: TestClient, user_token_headers):
    create_response = client.post(
        "/api/v1/items/",
        headers=user_token_headers,
        json={"title": "Specific Item", "description": "Fetch me"}
    )
    item_id = create_response.json()["id"]
    
    response = client.get(f"/api/v1/items/{item_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == item_id
    assert data["title"] == "Specific Item"

def test_delete_item(client: TestClient, user_token_headers):
    create_response = client.post(
        "/api/v1/items/",
        headers=user_token_headers,
        json={"title": "Delete Me", "description": "To be deleted"}
    )
    item_id = create_response.json()["id"]
    
    response = client.delete(f"/api/v1/items/{item_id}", headers=user_token_headers)
    assert response.status_code == 200
    
    # Verify it is deleted
    get_response = client.get(f"/api/v1/items/{item_id}")
    assert get_response.status_code == 404
