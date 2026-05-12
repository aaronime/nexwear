export interface GetAllMaterialsResponse {
    page: number;
    limit: number;
    total: number;
    pages: number;
    materials: Material[];
  }
  
  export interface Material {
    id: string;
    name: string;
  }