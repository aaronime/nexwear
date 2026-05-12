import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/shop/pages/actions/get-products.action";

export const useHomeNewArrivals = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["home", "products", "new-arrivals"],
    queryFn: () =>
      getProducts({
        sortBy: "newest",
        limit: "8",
        page: "1",
      }),
    staleTime: 1000 * 60 * 5,
  });

  return {
    products: data?.products ?? [],
    isLoading,
    isError,
  };
};
