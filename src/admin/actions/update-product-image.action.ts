import { productImagesApi } from "@/api/nexwearApi";
import type { ProductImage } from "../interfaces/getAllProductsResponse";

export interface UpdateProductImageParams {
  productImageId: string;
  order?: number;
  url?: string;
  uploadedFile?: File;
}

export const updateProductImage = async ({
  productImageId,
  order,
  url,
  uploadedFile,
}: UpdateProductImageParams): Promise<ProductImage> => {
  const form = new FormData();
  if (order !== undefined) {
    form.append("order", String(order));
  }
  if (uploadedFile) {
    form.append("uploadedFile", uploadedFile);
  } else if (url !== undefined) {
    const trimmed = url.trim();
    if (trimmed) {
      form.append("url", trimmed);
    }
  }

  const { data } = await productImagesApi.put<ProductImage>(
    `/${productImageId}`,
    form,
  );
  return data;
};
