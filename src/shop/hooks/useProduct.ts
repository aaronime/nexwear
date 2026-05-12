import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../pages/actions/get-product.action";

export const useProduct = (id: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });

  return {
    product: data,
    isLoading,
    isError,
    error,
  };
};
