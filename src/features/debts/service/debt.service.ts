import type {
  CreateDebtInput,
  UpdateDebtInput,
} from "@/lib/schemas/debt.schema";
import { ApiResponse } from "@/lib/api/types";
import { Debt } from "../types/debt";
import { axiosInstance } from "@/lib/axios";

export async function createDebt(payload: CreateDebtInput): Promise<Debt> {
  const response = await axiosInstance.post<ApiResponse<Debt>>(
    "/debts",
    payload,
  );
  return response.data.data;
}

export async function updateDebt(
  id: string,
  payload: UpdateDebtInput,
): Promise<Debt> {
  const response = await axiosInstance.patch<ApiResponse<Debt>>(
    `/debts/${id}`,
    payload,
  );

  return response.data.data;
}
