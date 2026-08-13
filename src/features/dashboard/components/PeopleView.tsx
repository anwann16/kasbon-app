import { useMemo } from "react";
import { formatRupiah, getInitials } from "@/lib/format";
import type { Debt } from "@/features/debts/types/debt";

export function PeopleView({ debts }: { debts: Debt[] }) {
  const groups = useMemo(() => {
    const map: Record<
      string,
      {
        counterpartName: string;
        receivable: number;
        payable: number;
        activeCount: number;
        lastActivity: string;
      }
    > = {};

    debts.forEach((debt) => {
      const name = debt.counterpartName;
      if (!map[name]) {
        map[name] = {
          counterpartName: name,
          receivable: 0,
          payable: 0,
          activeCount: 0,
          lastActivity: debt.createdAt,
        };
      }

      const g = map[name];
      if (!debt.settledAt) {
        if (debt.type === "owed_to_me") {
          g.receivable += debt.amount;
        } else {
          g.payable += debt.amount;
        }
        g.activeCount += 1;
      }

      if (new Date(debt.createdAt) > new Date(g.lastActivity)) {
        g.lastActivity = debt.createdAt;
      }
    });

    return Object.values(map).sort(
      (a, b) =>
        b.activeCount - a.activeCount ||
        a.counterpartName.localeCompare(b.counterpartName),
    );
  }, [debts]);

  if (!groups.length) {
    return (
      <div className="mt-4 rounded-[14px] border border-dashed border-[#CBD5D1] bg-white py-16 text-center">
        <h3 className="font-semibold text-slate-800">
          Tidak ada orang ditemukan
        </h3>
        <p className="mx-auto mt-2 max-w-xs text-sm text-[#64748B]">
          Coba ubah kata kunci pencarian atau filter Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      {groups.map((group) => {
        const net = group.receivable - group.payable;
        return (
          <article
            key={group.counterpartName}
            className="rounded-[14px] border border-[#E5E7EB] bg-white p-5 transition hover:border-[#D5DED9] hover:bg-[#FCFDFC]"
          >
            <div className="flex items-center gap-4">
              <div className="grid size-11 place-items-center rounded-full bg-[#EAF8F1] text-sm font-bold text-[#008A4C]">
                {getInitials(group.counterpartName)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900 truncate">
                  {group.counterpartName}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {group.activeCount} hutang/piutang aktif
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Status Saldo
                </p>
                <p
                  className={`text-[15px] font-bold mt-0.5 ${
                    net > 0
                      ? "text-[#008F4C]"
                      : net < 0
                        ? "text-[#D92D3E]"
                        : "text-[#64748B]"
                  }`}
                >
                  {net > 0
                    ? `Piutang: ${formatRupiah(net)}`
                    : net < 0
                      ? `Hutang: ${formatRupiah(Math.abs(net))}`
                      : "Lunas / Balance"}
                </p>
              </div>

              <span
                className={`rounded-[5px] px-2 py-1 text-[10px] font-semibold ${
                  net > 0
                    ? "bg-[#EAF8F1] text-[#008A4C]"
                    : net < 0
                      ? "bg-[#FDECEF] text-[#D92D3E]"
                      : "bg-[#F1F5F9] text-[#64748B]"
                }`}
              >
                {net > 0
                  ? "Dihutang ke saya"
                  : net < 0
                    ? "Saya hutang"
                    : "Lunas"}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
