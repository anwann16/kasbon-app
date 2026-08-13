"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createDebtSchema,
  type CreateDebtInput,
} from "@/lib/schemas/debt.schema";
import { toast } from "sonner";
import type { Debt } from "../types/debt";
import { createDebt } from "../service/debt.service";

export function useCreateDebt({
  onSuccess,
}: { onSuccess?: (newDebt: Debt) => void } = {}) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateDebtInput>({
    resolver: zodResolver(createDebtSchema) as any,
    defaultValues: {
      type: "owed_to_me",
      counterpart_name: "",
      amount: "" as any,
      note: "",
      due_date: new Date().toISOString().slice(0, 10),
    },
  });

  const onSubmit = async (data: CreateDebtInput) => {
    setError(null);

    try {
      const dbDebt = (await createDebt(data)) as any;
      const clientDebt: Debt = {
        id: dbDebt.id,
        type: dbDebt.type,
        counterpartName: dbDebt.counterpart_name || dbDebt.counterpartName,
        amount: dbDebt.amount,
        note: dbDebt.note || "",
        dueDate: dbDebt.due_date || dbDebt.dueDate || "",
        settledAt:
          dbDebt.settled_at !== undefined
            ? dbDebt.settled_at
            : dbDebt.settledAt || null,
        createdAt: dbDebt.created_at || dbDebt.createdAt,
      };

      toast.success("Catatan hutang/piutang berhasil dibuat!");

      form.reset();
      if (onSuccess) {
        onSuccess(clientDebt);
      }
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan saat menyimpan hutang/piutang.";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return {
    form,
    onSubmit,
    error,
    isSubmitting: form.formState.isSubmitting,
  };
}
