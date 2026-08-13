"use client";

import { useState, useMemo } from "react";
import type { Debt, DebtType, DebtStatusFilter, DebtSort } from "@/features/debts/types/debt";

interface UseDeptListProps {
  debts: Debt[];
  onToggle: (id: string) => void;
}

export function useDeptList({ debts, onToggle }: UseDeptListProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<DebtStatusFilter>("semua");
  const [type, setType] = useState<"semua" | DebtType>("semua");
  const [sort, setSort] = useState<DebtSort>("newest");
  const [view, setView] = useState<"list" | "people">("list");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetDebtId, setTargetDebtId] = useState<string | null>(null);

  const handleOpenConfirm = (id: string) => {
    setTargetDebtId(id);
    setConfirmOpen(true);
  };

  const handleConfirmToggle = () => {
    if (targetDebtId) {
      onToggle(targetDebtId);
    }
    setConfirmOpen(false);
    setTargetDebtId(null);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setTargetDebtId(null);
  };

  const visible = useMemo(
    () =>
      debts
        .filter(
          (debt) =>
            (debt.counterpartName || "")
              .toLowerCase()
              .includes(query.toLowerCase().trim()) &&
            (status === "semua" ||
              (status === "lunas"
                ? Boolean(debt.settledAt)
                : !debt.settledAt)) &&
            (type === "semua" || debt.type === type),
        )
        .sort((a, b) =>
          sort === "highest"
            ? b.amount - a.amount
            : sort === "lowest"
              ? a.amount - b.amount
              : sort === "oldest"
                ? a.createdAt.localeCompare(b.createdAt)
                : b.createdAt.localeCompare(a.createdAt),
        ),
    [debts, query, status, type, sort],
  );

  return {
    query,
    setQuery,
    status,
    setStatus,
    type,
    setType,
    sort,
    setSort,
    view,
    setView,
    confirmOpen,
    setConfirmOpen,
    targetDebtId,
    handleOpenConfirm,
    handleConfirmToggle,
    handleCloseConfirm,
    visible,
  };
}
