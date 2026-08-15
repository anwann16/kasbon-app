"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Debt, DebtStatusFilter, DebtSort, DebtType } from "../types/debt";
import { useGetDebts } from "../hooks/useGetDebts";
import { updateDebt, deleteDebt } from "../service/debt.service";
import { toast } from "sonner";

interface DebtContextType {
  debts: Debt[];
  allDebts: Debt[];
  isLoading: boolean;
  isListLoading: boolean;

  receivable: number;
  payable: number;
  net: number;
  receivedCount: number;
  owedCount: number;

  search: string;
  setSearch: (val: string) => void;
  status: DebtStatusFilter;
  setStatus: (val: DebtStatusFilter) => void;
  type: "semua" | DebtType;
  setType: (val: "semua" | DebtType) => void;
  sort: DebtSort;
  setSort: (val: DebtSort) => void;

  view: "list" | "people";
  setView: (val: "list" | "people") => void;

  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  editingDebt: Debt | null;
  setEditingDebt: (val: Debt | null) => void;
  deleteConfirmOpen: boolean;
  setDeleteConfirmOpen: (val: boolean) => void;
  targetDeleteId: string | null;
  setTargetDeleteId: (val: string | null) => void;

  handleOpenCreate: () => void;
  handleOpenEdit: (debt: Debt) => void;
  handleCloseModal: () => void;
  handleRequestDelete: (id: string) => void;
  handleConfirmDelete: () => Promise<void>;
  handleToggleSettled: (id: string) => Promise<void>;
  handleAddSuccess: (newOrUpdatedDebt: Debt) => void;
}

const DebtContext = createContext<DebtContextType | undefined>(undefined);

export function DebtProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<DebtStatusFilter>("semua");
  const [type, setType] = useState<"semua" | DebtType>("semua");
  const [sort, setSort] = useState<DebtSort>("newest");
  const [view, setView] = useState<"list" | "people">("list");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch debt untuk kalkulasi sumary dan bar chart
  const {
    debts: allDebts,
    setDebts: setAllDebts,
    isLoading: isAllLoading,
  } = useGetDebts();

  // Fetch debt untuk table list + filter params
  const {
    debts: filteredDebts,
    setDebts: setFilteredDebts,
    isLoading: isFilteredLoading,
  } = useGetDebts({
    search: debouncedSearch ? debouncedSearch.trim() : undefined,
    status:
      status === "semua"
        ? undefined
        : status === "lunas"
          ? "settled"
          : "unsettled",
    type: type === "semua" ? undefined : type,
    sort,
  });

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
      setAllDebts((prev) => prev.filter((d) => d.id !== targetDeleteId));
      setFilteredDebts((prev) => prev.filter((d) => d.id !== targetDeleteId));
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
    const debtToUpdate = allDebts.find((d) => d.id === id);
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

      setAllDebts((prev) =>
        prev.map((d) => (d.id === id ? updatedClientDebt : d)),
      );
      setFilteredDebts((prev) =>
        prev.map((d) => (d.id === id ? updatedClientDebt : d)),
      );
      toast.success("Catatan ditandai sebagai lunas!");
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Gagal mengubah status lunas.";
      toast.error(errMsg);
    }
  };

  const handleAddSuccess = (newOrUpdatedDebt: Debt) => {
    const updateList = (prev: Debt[]) => {
      const exists = prev.some((d) => d.id === newOrUpdatedDebt.id);
      if (exists) {
        return prev.map((d) =>
          d.id === newOrUpdatedDebt.id ? newOrUpdatedDebt : d,
        );
      } else {
        return [newOrUpdatedDebt, ...prev];
      }
    };
    setAllDebts(updateList);
    setFilteredDebts(updateList);
  };

  const receivable = allDebts.reduce(
    (sum, debt) =>
      sum + (!debt.settledAt && debt.type === "owed_to_me" ? debt.amount : 0),
    0,
  );
  const payable = allDebts.reduce(
    (sum, debt) =>
      sum + (!debt.settledAt && debt.type === "i_owe" ? debt.amount : 0),
    0,
  );
  const net = receivable - payable;

  const receivedCount = allDebts.filter(
    (debt) => !debt.settledAt && debt.type === "owed_to_me",
  ).length;
  const owedCount = allDebts.filter(
    (debt) => !debt.settledAt && debt.type === "i_owe",
  ).length;

  return (
    <DebtContext.Provider
      value={{
        debts: filteredDebts,
        allDebts,
        isLoading: isAllLoading,
        isListLoading: isFilteredLoading,
        receivable,
        payable,
        net,
        receivedCount,
        owedCount,
        search,
        setSearch,
        status,
        setStatus,
        type,
        setType,
        sort,
        setSort,
        view,
        setView,
        isModalOpen,
        setIsModalOpen,
        editingDebt,
        setEditingDebt,
        deleteConfirmOpen,
        setDeleteConfirmOpen,
        targetDeleteId,
        setTargetDeleteId,
        handleOpenCreate,
        handleOpenEdit,
        handleCloseModal,
        handleRequestDelete,
        handleConfirmDelete,
        handleToggleSettled,
        handleAddSuccess,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
}

export function useDebt() {
  const context = useContext(DebtContext);
  if (context === undefined) {
    throw new Error("useDebt must be used within a DebtProvider");
  }
  return context;
}
