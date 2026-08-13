"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createDebtSchema,
  type CreateDebtInput,
} from "@/lib/schemas/debt.schema";
import { toast } from "sonner";
import type { Debt } from "../types/debt";
import { createDebt, updateDebt } from "../service/debt.service";

export function useDebtForm({
  editingDebt,
  onSuccess,
}: {
  editingDebt: Debt | null;
  onSuccess?: (debt: Debt) => void;
}) {
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

  useEffect(() => {
    if (editingDebt) {
      form.reset({
        type: editingDebt.type,
        counterpart_name: editingDebt.counterpartName,
        amount: editingDebt.amount,
        note: editingDebt.note || "",
        due_date: editingDebt.dueDate ? editingDebt.dueDate.slice(0, 10) : "",
      });
    } else {
      form.reset({
        type: "owed_to_me",
        counterpart_name: "",
        amount: "" as any,
        note: "",
        due_date: new Date().toISOString().slice(0, 10),
      });
    }
  }, [editingDebt, form]);

  const onSubmit = async (data: CreateDebtInput) => {
    setError(null);

    try {
      let dbDebt: any;
      if (editingDebt) {
        dbDebt = (await updateDebt(editingDebt.id, {
          type: data.type,
          counterpart_name: data.counterpart_name,
          amount: data.amount,
          note: data.note,
          due_date: data.due_date,
        })) as any;
      } else {
        dbDebt = (await createDebt(data)) as any;
      }

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

      toast.success(
        editingDebt
          ? "Catatan hutang/piutang berhasil diperbarui!"
          : "Catatan hutang/piutang berhasil dibuat!"
      );

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
