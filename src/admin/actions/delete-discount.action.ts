import { discountsApi } from "@/api/nexwearApi";
import type { Discount } from "../interfaces/getAllDiscountsResponse";

export const deleteDiscount = async (discountId: string): Promise<Discount> => {
  const { data } = await discountsApi.delete(`/${discountId}`);
  return data;
};