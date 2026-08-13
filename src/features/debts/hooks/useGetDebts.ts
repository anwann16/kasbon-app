"use client";

import { useEffect, useState, useCallback } from "react";
import { getDebts } from "../service/debt.service";
import type { GetDebtsInput } from "@/lib/schemas/debt.schema";
import type { Debt } from "../types/debt";
import { toast } from "sonner";

export function useGetDebts(initialParams?: GetDebtsInput) {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDebts = useCallback(async (filterParams?: GetDebtsInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDebts(filterParams) as any[];
      const clientDebts: Debt[] = data.map((dbDebt) => ({
        id: dbDebt.id,
        type: dbDebt.type,
        counterpartName: dbDebt.counterpart_name || dbDebt.counterpartName,
        amount: dbDebt.amount,
        note: dbDebt.note || "",
        dueDate: dbDebt.due_date || dbDebt.dueDate || "",
        settledAt: dbDebt.settled_at !== undefined ? dbDebt.settled_at : dbDebt.settledAt || null,
        createdAt: dbDebt.created_at || dbDebt.createdAt,
      }));
      setDebts(clientDebts);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Gagal memuat data utang.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDebts(initialParams);
  }, [fetchDebts]);

  return {
    debts,
    setDebts,
    isLoading,
    error,
    refetch: () => fetchDebts(initialParams),
  };
}
