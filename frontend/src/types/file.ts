export interface FileResponse {
  id: number;
  filename: string;
  object_name: string;
  content_type: string;
  owner_id: number;
}

export interface PresignedUrlResponse {
  url: string;
}
