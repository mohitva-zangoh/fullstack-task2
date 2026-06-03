import io
from fastapi.testclient import TestClient
from unittest.mock import patch

def test_upload_file(client: TestClient, user_token_headers):
    # Mock the MinIO upload function so we don't actually need MinIO for the unit test
    with patch("app.api.v1.routes.files.upload_to_minio", return_value=True):
        file_content = b"test file content"
        response = client.post(
            "/api/v1/files/upload",
            headers=user_token_headers,
            files={"file": ("test.txt", file_content, "text/plain")}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["filename"] == "test.txt"
        assert data["content_type"] == "text/plain"
        assert "id" in data

def test_get_file_url(client: TestClient, user_token_headers):
    # Create file record
    with patch("app.api.v1.routes.files.upload_to_minio", return_value=True):
        upload_response = client.post(
            "/api/v1/files/upload",
            headers=user_token_headers,
            files={"file": ("test2.txt", b"content", "text/plain")}
        )
        file_id = upload_response.json()["id"]

    # Test getting URL
    with patch("app.api.v1.routes.files.get_presigned_url", return_value="http://fake-minio-url/test"):
        response = client.get(f"/api/v1/files/{file_id}/url")
        assert response.status_code == 200
        assert "url" in response.json()
        assert response.json()["url"] == "http://fake-minio-url/test"

def test_download_file(client: TestClient, user_token_headers):
    # Create file record
    with patch("app.api.v1.routes.files.upload_to_minio", return_value=True):
        upload_response = client.post(
            "/api/v1/files/upload",
            headers=user_token_headers,
            files={"file": ("download.txt", b"download this", "text/plain")}
        )
        file_id = upload_response.json()["id"]

    # Test download
    with patch("app.api.v1.routes.files.download_from_minio", return_value=b"download this"):
        response = client.get(f"/api/v1/files/{file_id}/download", headers=user_token_headers)
        assert response.status_code == 200
        assert response.content == b"download this"
