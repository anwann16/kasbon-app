"use client";

import {
  CalendarDays,
  Check,
  List,
  Pencil,
  Trash2,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { formatRelativeDate, formatRupiah, getInitials } from "@/lib/format";
import type {
  Debt,
  DebtType,
  DebtStatusFilter,
  DebtSort,
} from "@/features/debts/types/debt";

import { Select } from "./Select";
import { PeopleView } from "./PeopleView";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { useDeptList } from "../../debts/hooks/useDeptList";

export function DeptList({
  debts,
  onEdit,
  onDelete,
  onToggle,
}: {
  debts: Debt[];
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const {
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
    handleOpenConfirm,
    handleConfirmToggle,
    visible,
  } = useDeptList({ debts, onToggle });

  if (!debts.length) {
    return (
      <div className="mt-4 rounded-[14px] border border-dashed border-[#CBD5D1] bg-white py-16 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#EAF8F1] text-[#009B55]">
          <List size={22} />
        </div>
        <h3 className="mt-4 font-semibold">Belum ada hutang/piutang</h3>
        <p className="mx-auto mt-2 max-w-xs text-sm text-[#64748B]">
          Catat utang atau piutang pertamamu supaya semuanya lebih mudah
          diingat.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[#111827]">
            Daftar Hutang/Piutang
          </h2>
          <p className="text-sm text-[#64748B]">
            Total {debts.length} Hutang/Piutang tercatat
          </p>
        </div>
        <div className="flex rounded-lg bg-[#F1F5F9] p-0.5">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              view === "list"
                ? "bg-[#009B55] text-white shadow-sm"
                : "text-[#64748B] hover:text-[#008A4C] hover:bg-slate-50"
            }`}
          >
            <List size={14} />
            List Hutang/Piutang
          </button>
          <button
            onClick={() => setView("people")}
            className={`flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              view === "people"
                ? "bg-[#009B55] text-white shadow-sm"
                : "text-[#64748B] hover:text-[#008A4C] hover:bg-slate-50"
            }`}
          >
            <Users size={14} />
            Group per orang
          </button>
        </div>
      </div>

      <div className="grid gap-2 rounded-xl border border-[#E5E7EB] bg-white p-3 sm:grid-cols-2 lg:grid-cols-[1fr_150px_150px_170px_42px]">
        <label className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-3 text-[#94A3B8]" size={18} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari hutang/piutang..."
            className="h-11 w-full rounded-[9px] bg-[#F8FAF9] pl-10 pr-3 text-sm outline-none placeholder:text-[#94A3B8] focus:bg-[#F3F6F5]"
          />
        </label>
        <Select
          value={status}
          onChange={(val) => setStatus(val as DebtStatusFilter)}
          options={[
            { value: "semua", label: "Semua status" },
            { value: "belum", label: "Belum lunas" },
            { value: "lunas", label: "Lunas" },
          ]}
        />
        <Select
          value={type}
          onChange={(val) => setType(val as "semua" | DebtType)}
          options={[
            { value: "semua", label: "Semua tipe" },
            { value: "owed_to_me", label: "Dihutang ke saya" },
            { value: "i_owe", label: "Saya hutang" },
          ]}
        />
        <Select
          value={sort}
          onChange={(val) => setSort(val as DebtSort)}
          options={[
            { value: "newest", label: "Urutkan: Terbaru" },
            { value: "oldest", label: "Urutkan: Terlama" },
            { value: "highest", label: "Urutkan: Nominal terbesar" },
            { value: "lowest", label: "Urutkan: Nominal terkecil" },
          ]}
        />
        <button
          aria-label="Filter lanjutan"
          className="grid h-11 place-items-center rounded-[9px] border border-[#E5E7EB] text-[#64748B] hover:bg-[#F8FAF9]"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {view === "people" ? (
        <PeopleView debts={visible} />
      ) : !visible.length ? (
        <div className="mt-4 rounded-[14px] border border-dashed border-[#CBD5D1] bg-white py-16 text-center">
          <h3 className="font-semibold text-slate-800">
            Tidak ada hutang/piutang ditemukan
          </h3>
          <p className="mx-auto mt-2 max-w-xs text-sm text-[#64748B]">
            Coba ubah kata kunci pencarian atau filter Anda.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {visible.map((debt) => (
            <article
              key={debt.id}
              className="group rounded-[13px] border border-[#E5E7EB] bg-white p-4 transition hover:border-[#D5DED9] hover:bg-[#FCFDFC] sm:p-5"
            >
              <div className="grid gap-4 md:grid-cols-[42px_1fr_150px_150px_200px] md:items-center">
                <div className="grid size-10.5 place-items-center rounded-full bg-[#EAF8F1] text-sm font-semibold text-[#008A4C]">
                  {getInitials(debt.counterpartName)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[15px] font-semibold">
                      {debt.counterpartName}
                    </h3>
                    <span
                      className={`rounded-[5px] px-2 py-1 text-[11px] font-semibold ${
                        debt.type === "owed_to_me"
                          ? "bg-[#EAF8F1] text-[#008A4C]"
                          : "bg-[#FDECEF] text-[#D92D3E]"
                      }`}
                    >
                      {debt.type === "owed_to_me"
                        ? "Dihutang ke saya"
                        : "Saya hutang"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#64748B] line-clamp-1">
                    {debt.note || "Tidak ada catatan"}
                  </p>
                </div>
                <div>
                  <p
                    className={`font-semibold text-[15px] ${
                      debt.type === "owed_to_me"
                        ? "text-[#008F4C]"
                        : "text-[#D92D3E]"
                    }`}
                  >
                    {debt.type === "owed_to_me" ? "+" : "-"}
                    {formatRupiah(debt.amount)}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-[#64748B]">
                    <CalendarDays size={13} />
                    {formatRelativeDate(debt.createdAt)}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-flex rounded-[5px] px-2 py-1 text-xs font-semibold ${
                      debt.settledAt
                        ? "bg-[#EAF8F1] text-[#008A4C]"
                        : "bg-[#FFF5DF] text-[#C77700]"
                    }`}
                  >
                    {debt.settledAt ? (
                      <>
                        <Check size={13} className="mr-1" />
                        Lunas
                      </>
                    ) : (
                      "Belum lunas"
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 md:justify-end">
                  {!debt.settledAt && (
                    <button
                      onClick={() => handleOpenConfirm(debt.id)}
                      className="rounded-[7px] border border-[#009B55] px-2.5 py-2 text-xs font-semibold text-[#008A4C] hover:bg-[#EAF8F1] cursor-pointer"
                    >
                      Tandai lunas
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(debt)}
                    aria-label="Edit hutang/piutang"
                    className="grid size-9 place-items-center rounded-[7px] text-[#64748B] hover:bg-[#F8FAF9]"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(debt.id)}
                    aria-label="Hapus hutang/piutang"
                    className="grid size-9 place-items-center rounded-[7px] text-[#EF4444] hover:bg-[#FEF2F2]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmToggle}
        title="Tandai Sebagai Lunas"
        description="Apakah kamu yakin ingin menandai hutang/piutang ini sebagai lunas? Tindakan ini tidak dapat dibatalkan atau dikembalikan lagi."
        confirmText="Ya, Lunas"
        cancelText="Batal"
        confirmVariant="success"
      />
    </div>
  );
}
