from minio import Minio
from minio.error import S3Error
from app.core.config import settings
import io

minio_client = Minio(
    settings.MINIO_ENDPOINT,
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=settings.MINIO_SECURE
)

def create_bucket(bucket_name: str):
    try:
        found = minio_client.bucket_exists(bucket_name)
        if not found:
            minio_client.make_bucket(bucket_name)
            print(f"Bucket '{bucket_name}' created successfully")
        else:
            print(f"Bucket '{bucket_name}' already exists")
    except S3Error as err:
        print(f"Error creating bucket: {err}")

def upload_to_minio(bucket_name: str, object_name: str, data: bytes, content_type: str = "application/octet-stream"):
    try:
        minio_client.put_object(
            bucket_name,
            object_name,
            io.BytesIO(data),
            length=len(data),
            content_type=content_type
        )
        return True
    except S3Error as err:
        print(f"Error uploading file: {err}")
        return False

def download_from_minio(bucket_name: str, object_name: str):
    try:
        response = minio_client.get_object(bucket_name, object_name)
        return response.read()
    except S3Error as err:
        print(f"Error downloading file: {err}")
        return None
    finally:
        if 'response' in locals():
            response.close()
            response.release_conn()

def get_presigned_url(bucket_name: str, object_name: str):
    try:
        url = minio_client.presigned_get_object(bucket_name, object_name)
        return url
    except S3Error as err:
        print(f"Error getting presigned URL: {err}")
        return None
