import { discountsApi } from "@/api/nexwearApi";
import type { Discount } from "../interfaces/getAllDiscountsResponse";

export interface CreateDiscountPayload {
  name: string;
  percentage: number;
  startDate: Date;
  endDate: Date;
}

export const createDiscount = async (
  payload: CreateDiscountPayload,
): Promise<Discount> => {
  const { name, percentage, startDate, endDate } = payload;
  const { data } = await discountsApi.post("/", {
    name,
    percentage,
    startDate,
    endDate,
  });
  return data;
};
