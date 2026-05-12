import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getAllProductImages } from "@/admin/actions/get-all-product-images.action";

export const productImagesQueryKey = (productId: string | undefined) =>
  ["product-images", productId] as const;

export const useProductImages = (productId: string | undefined) => {
  const authStatus = useAuthStore((s) => s.authStatus);

  return useQuery({
    queryKey: productImagesQueryKey(productId),
    queryFn: () => getAllProductImages(productId!),
    enabled: authStatus === "authenticated" && !!productId,
    staleTime: 1000 * 30,
  });
};
