import { discountsApi } from "@/api/nexwearApi";
import type { Discount } from "../interfaces/getAllDiscountsResponse";

export interface UpdateDiscountPayload {
  discountId?: string;
  name?: string;
  percentage?: number;
  startDate?: Date;
  endDate?: Date;
}

export const updateDiscount = async ({
  discountId,
  name,
  percentage,
  startDate,
  endDate,
}: UpdateDiscountPayload): Promise<Discount> => {
  const { data } = await discountsApi.put(`/${discountId}`, {
    name,
    percentage,
    startDate,
    endDate,
  });
  return data;
};
