import { productImagesApi } from "@/api/nexwearApi";
import type { ProductImage } from "../interfaces/getAllProductsResponse";

export interface CreateProductImagePayload {
  productId: string;
  order: number;
  url?: string;
  uploadedFile?: File;
}

export const createProductImage = async (
  payload: CreateProductImagePayload,
): Promise<ProductImage> => {
  const { productId, order, url, uploadedFile } = payload;
  if (!uploadedFile && !url?.trim()) {
    throw new Error("Debe indicarse url o archivo");
  }

  const form = new FormData();
  form.append("productId", productId);
  form.append("order", String(order));
  if (uploadedFile) {
    form.append("uploadedFile", uploadedFile);
  } else {
    form.append("url", url!.trim());
  }

  const { data } = await productImagesApi.post<ProductImage>("/", form);
  return data;
};
