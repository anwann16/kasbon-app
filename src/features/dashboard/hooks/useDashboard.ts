"use client";

import { useState } from "react";
import { useGetDebts } from "@/features/debts/hooks/useGetDebts";
import { updateDebt, deleteDebt } from "@/features/debts/service/debt.service";
import { toast } from "sonner";
import type { Debt } from "@/features/debts/types/debt";

export function useDashboard() {
  const { debts, setDebts, isLoading } = useGetDebts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingDebt(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (debt: Debt) => {
    setEditingDebt(debt);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDebt(null);
  };

  const handleRequestDelete = (id: string) => {
    setTargetDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetDeleteId) return;
    try {
      await deleteDebt(targetDeleteId);
      setDebts((prev) => prev.filter((d) => d.id !== targetDeleteId));
      toast.success("Catatan hutang/piutang berhasil dihapus!");
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Gagal menghapus catatan.";
      toast.error(errMsg);
    } finally {
      setDeleteConfirmOpen(false);
      setTargetDeleteId(null);
    }
  };

  const handleToggleSettled = async (id: string) => {
    const debtToUpdate = debts.find((d) => d.id === id);
    if (!debtToUpdate) return;

    if (debtToUpdate.settledAt) {
      toast.error(
        "Hutang/piutang yang sudah lunas tidak dapat dibuka kembali.",
      );
      return;
    }

    const newSettledState = true;

    try {
      const updatedDbDebt = (await updateDebt(id, {
        settled: newSettledState,
      })) as any;
      const updatedClientDebt: Debt = {
        id: updatedDbDebt.id,
        type: updatedDbDebt.type,
        counterpartName:
          updatedDbDebt.counterpart_name || updatedDbDebt.counterpartName,
        amount: updatedDbDebt.amount,
        note: updatedDbDebt.note || "",
        dueDate: updatedDbDebt.due_date || updatedDbDebt.dueDate || "",
        settledAt:
          updatedDbDebt.settled_at !== undefined
            ? updatedDbDebt.settled_at
            : updatedDbDebt.settledAt || null,
        createdAt: updatedDbDebt.created_at || updatedDbDebt.createdAt,
      };

      setDebts((prev) =>
        prev.map((d) => (d.id === id ? updatedClientDebt : d)),
      );
      toast.success(
        newSettledState
          ? "Catatan ditandai sebagai lunas!"
          : "Catatan ditandai sebagai belum lunas!",
      );
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Gagal mengubah status lunas.";
      toast.error(errMsg);
    }
  };

  const handleAddSuccess = (newOrUpdatedDebt: Debt) => {
    setDebts((prev) => {
      const exists = prev.some((d) => d.id === newOrUpdatedDebt.id);
      if (exists) {
        return prev.map((d) =>
          d.id === newOrUpdatedDebt.id ? newOrUpdatedDebt : d,
        );
      } else {
        return [newOrUpdatedDebt, ...prev];
      }
    });
  };

  const receivable = debts.reduce(
    (sum, debt) =>
      sum + (!debt.settledAt && debt.type === "owed_to_me" ? debt.amount : 0),
    0,
  );
  const payable = debts.reduce(
    (sum, debt) =>
      sum + (!debt.settledAt && debt.type === "i_owe" ? debt.amount : 0),
    0,
  );
  const net = receivable - payable;

  const receivedCount = debts.filter(
    (debt) => !debt.settledAt && debt.type === "owed_to_me",
  ).length;
  const owedCount = debts.filter(
    (debt) => !debt.settledAt && debt.type === "i_owe",
  ).length;

  return {
    debts,
    setDebts,
    isLoading,
    isModalOpen,
    editingDebt,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleRequestDelete,
    handleConfirmDelete,
    handleToggleSettled,
    handleAddSuccess,
    receivable,
    payable,
    net,
    receivedCount,
    owedCount,
  };
}
