export interface GetAllBrandsResponse {
    page: number;
    limit: number;
    total: number;
    pages: number;
    brands: Brand[];
}

export interface Brand {
    id: string;
    name: string;
}
