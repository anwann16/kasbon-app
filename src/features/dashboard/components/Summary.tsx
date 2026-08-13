import { formatRupiah } from "@/lib/format";
import { ArrowUpRight } from "lucide-react";

export function Summary({
  receivable,
  payable,
  net,
  receivedCount,
  owedCount,
}: {
  receivable: number;
  payable: number;
  net: number;
  receivedCount: number;
  owedCount: number;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <SummaryCard
        title="Dihutang ke saya"
        amount={receivable}
        count={`${receivedCount} hutang/piutang`}
        color="green"
        icon={ArrowUpRight}
      />
      <SummaryCard
        title="Saya hutang"
        amount={payable}
        count={`${owedCount} hutang/piutang`}
        color="red"
        icon={ArrowUpRight}
      />
      <SummaryCard
        title="Net saya"
        amount={net}
        count={net >= 0 ? "Posisi saya aman" : "Perlu lebih hati-hati"}
        color="purple"
        icon={ArrowUpRight}
      />
    </section>
  );
}

function SummaryCard({
  title,
  amount,
  count,
  color,
  icon: Icon,
}: {
  title: string;
  amount: number;
  count: string;
  color: "green" | "red" | "purple";
  icon: typeof ArrowUpRight;
}) {
  const colors = {
    green: "bg-[#EAF8F1] text-[#008A4C]",
    red: "bg-[#FDECEF] text-[#D92D3E]",
    purple: "bg-[#F1EDFF] text-[#673DE6]",
  };
  return (
    <article
      className={`relative min-h-42.5 overflow-hidden rounded-[15px] border border-[#E5E7EB] bg-white p-5 ${
        color === "green"
          ? "after:bg-[#EAF8F1]"
          : color === "red"
            ? "after:bg-[#FDECEF]"
            : "after:bg-[#F1EDFF]"
      } after:absolute after:-bottom-16 after:-right-8 after:size-36 after:rounded-full after:opacity-60`}
    >
      <div className="relative z-10 flex items-start justify-between">
        <p className="text-sm font-medium text-[#475569]">{title}</p>
        <span
          className={`grid size-8 place-items-center rounded-lg ${colors[color]}`}
        >
          <Icon size={16} />
        </span>
      </div>
      <p
        className={`relative z-10 mt-9 text-[27px] font-bold tracking-[-.04em] ${
          color === "green"
            ? "text-[#008F4C]"
            : color === "red"
              ? "text-[#D92D3E]"
              : "text-[#673DE6]"
        }`}
      >
        {formatRupiah(amount)}
      </p>
      <p className="relative z-10 mt-2 text-xs text-[#64748B]">{count}</p>
    </article>
  );
}
