export interface ItemBase {
  title: string;
  description?: string;
  image_url?: string;
}

export type ItemCreate = ItemBase;

export interface ItemResponse extends ItemBase {
  id: number;
  owner_id: number;
}

export interface GetItemsParams {
  skip?: number;
  limit?: number;
  search?: string;
}
