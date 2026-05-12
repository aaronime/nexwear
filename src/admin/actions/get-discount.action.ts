import { discountsApi } from "@/api/nexwearApi";
import type { Discount } from "../interfaces/getAllDiscountsResponse";

export const getDiscount = async (discountId: string): Promise<Discount> => {
  const { data } = await discountsApi.get(`/${discountId}`);
  return data;
};
