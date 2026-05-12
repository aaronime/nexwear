export interface GetAllTagsResponse {
    page: number;
    limit: number;
    total: number;
    pages: number;
    tags: Tag[];
  }
  
  export interface Tag {
    id: string;
    name: string;
  }