import { useState, useMemo } from "react";
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
import type { Debt, DebtType, DebtStatusFilter, DebtSort } from "../pages/mock";

import { Select } from "./Select";
import { PeopleView } from "./PeopleView";

export function TransactionList({
  debts,
  onEdit,
  onDelete,
  onToggle,
  onCreate,
}: {
  debts: Debt[];
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onCreate: () => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<DebtStatusFilter>("semua");
  const [type, setType] = useState<"semua" | DebtType>("semua");
  const [sort, setSort] = useState<DebtSort>("newest");
  const [view, setView] = useState<"list" | "people">("list");

  // Filtering and sorting logic
  const visible = useMemo(
    () =>
      debts
        .filter(
          (debt) =>
            debt.counterpartName
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

  // If there are absolutely no transactions overall
  if (!debts.length) {
    return (
      <div className="mt-4 rounded-[14px] border border-dashed border-[#CBD5D1] bg-white py-16 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#EAF8F1] text-[#009B55]">
          <List size={22} />
        </div>
        <h3 className="mt-4 font-semibold">Belum ada transaksi</h3>
        <p className="mx-auto mt-2 max-w-xs text-sm text-[#64748B]">
          Catat utang atau piutang pertamamu supaya semuanya lebih mudah
          diingat.
        </p>
        <button
          onClick={onCreate}
          className="mt-5 rounded-[9px] bg-[#009B55] px-4 py-2.5 text-sm font-semibold text-white"
        >
          + Catat transaksi
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Header and View Tabs */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[#111827]">
            Transaksi
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Semua catatan utang piutangmu.
          </p>
        </div>
        <div className="flex rounded-[10px] border border-[#E5E7EB] bg-white p-1">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
              view === "list" ? "bg-[#EAF8F1] text-[#008A4C]" : "text-[#64748B]"
            }`}
          >
            <List size={15} /> List transaksi
          </button>
          <button
            onClick={() => setView("people")}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
              view === "people"
                ? "bg-[#EAF8F1] text-[#008A4C]"
                : "text-[#64748B]"
            }`}
          >
            <Users size={15} /> Group per orang
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid gap-2 rounded-xl border border-[#E5E7EB] bg-white p-3 sm:grid-cols-2 lg:grid-cols-[1fr_150px_150px_170px_42px]">
        <label className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-3 text-[#94A3B8]" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama orang..."
            className="h-11 w-full rounded-[9px] border border-[#E5E7EB] pl-10 pr-3 text-sm outline-none focus:border-[#009B55] focus:ring-2 focus:ring-[#009B55]/15"
          />
        </label>
        <Select
          value={status}
          onChange={(value) => setStatus(value as DebtStatusFilter)}
          options={[
            ["semua", "Semua status"],
            ["lunas", "Lunas"],
            ["belum", "Belum lunas"],
          ]}
        />
        <Select
          value={type}
          onChange={(value) => setType(value as "semua" | DebtType)}
          options={[
            ["semua", "Semua tipe"],
            ["owed_to_me", "Dihutang ke saya"],
            ["i_owe", "Saya hutang"],
          ]}
        />
        <Select
          value={sort}
          onChange={(value) => setSort(value as DebtSort)}
          options={[
            ["newest", "Urutkan: Terbaru"],
            ["oldest", "Terlama"],
            ["highest", "Nominal terbesar"],
            ["lowest", "Nominal terkecil"],
          ]}
        />
        <button
          aria-label="Filter lanjutan"
          className="grid h-11 place-items-center rounded-[9px] border border-[#E5E7EB] text-[#64748B] hover:bg-[#F8FAF9]"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Transactions Output */}
      {view === "people" ? (
        <PeopleView debts={visible} />
      ) : !visible.length ? (
        <div className="mt-4 rounded-[14px] border border-dashed border-[#CBD5D1] bg-white py-16 text-center">
          <h3 className="font-semibold text-slate-800">
            Tidak ada transaksi ditemukan
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
              <div className="grid gap-4 md:grid-cols-[42px_1fr_150px_150px_auto] md:items-center">
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
                  <p className="mt-1 text-sm text-[#64748B]">
                    {debt.note || "Tanpa catatan"}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-base font-bold ${
                      debt.type === "owed_to_me"
                        ? "text-[#008F4C]"
                        : "text-[#D92D3E]"
                    }`}
                  >
                    {formatRupiah(debt.amount)}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-[#64748B]">
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
                  <button
                    onClick={() => onToggle(debt.id)}
                    className="rounded-[7px] border border-[#009B55] px-2.5 py-2 text-xs font-semibold text-[#008A4C] hover:bg-[#EAF8F1]"
                  >
                    {debt.settledAt ? "Buka lagi" : "Tandai lunas"}
                  </button>
                  <button
                    onClick={() => onEdit(debt)}
                    aria-label="Edit transaksi"
                    className="grid size-9 place-items-center rounded-[7px] text-[#64748B] hover:bg-[#F8FAF9]"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(debt.id)}
                    aria-label="Hapus transaksi"
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
    </div>
  );
}
