"use client";

import { formatRupiah } from "@/lib/format";

export function BarChart({
  receivable,
  payable,
  net,
}: {
  receivable: number;
  payable: number;
  net: number;
}) {
  const maxVal = Math.max(receivable, payable, 1000);
  const total = receivable + payable;
  const receivableRatio = total > 0 ? (receivable / total) * 100 : 0;
  const payableRatio = total > 0 ? (payable / total) * 100 : 0;

  return (
    <section className="rounded-[15px] border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        Perbandingan Saldo
      </h3>
      <p className="text-xs text-[#64748B] mt-0.5">
        Komparasi total piutang vs total hutang kamu
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_250px]">
        <div className="flex flex-col justify-center items-center rounded-xl bg-[#F8FAF9] p-5 min-h-60 border border-[#EEF1F0]">
          <div className="w-full max-w-md">
            <div className="flex justify-between text-xs font-semibold text-[#64748B] mb-2 px-1">
              <span>{formatRupiah(maxVal)}</span>
              <span>{formatRupiah(0)}</span>
            </div>

            <div className="flex h-36 items-end justify-around gap-6 border-b border-[#E2E8F0] pb-2">
              <div className="flex flex-col items-center justify-end h-full w-full gap-2">
                <div className="relative flex-1 w-full flex items-end justify-center">
                  <div
                    style={{
                      height: `${Math.max(4, (receivable / maxVal) * 100)}%`,
                    }}
                    className="w-full max-w-20 rounded-t-lg bg-[#009B55] transition-all duration-500 hover:bg-[#008A4C] hover:scale-[1.02] cursor-pointer shadow-sm relative group"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-[#111827] px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none shadow-md">
                      {formatRupiah(receivable)}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#475569] whitespace-nowrap">
                  Dihutang ke Saya
                </span>
              </div>

              <div className="flex flex-col items-center justify-end h-full w-full gap-2">
                <div className="relative flex-1 w-full flex items-end justify-center">
                  <div
                    style={{
                      height: `${Math.max(4, (payable / maxVal) * 100)}%`,
                    }}
                    className="w-full max-w-20 rounded-t-lg bg-[#D92D3E] transition-all duration-500 hover:bg-[#B91C1C] hover:scale-[1.02] cursor-pointer shadow-sm relative group"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-[#111827] px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none shadow-md">
                      {formatRupiah(payable)}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#475569] whitespace-nowrap">
                  Saya Hutang
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between border-l border-[#F1F5F9] pl-6 md:mt-0 mt-4">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Rasio Piutang
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-[#008F4C]">
                  {Math.round(receivableRatio)}%
                </span>
                <div className="h-2 w-28 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div
                    style={{ width: `${receivableRatio}%` }}
                    className="h-full bg-[#009B55]"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Rasio Hutang
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-[#D92D3E]">
                  {Math.round(payableRatio)}%
                </span>
                <div className="h-2 w-28 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div
                    style={{ width: `${payableRatio}%` }}
                    className="h-full bg-[#D92D3E]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#EEF1F0] pt-4 mt-4">
            <p className="text-xs text-[#64748B] leading-relaxed">
              {net > 0
                ? "Saldo bersih kamu positif. Total uang yang dihutang orang lain ke kamu lebih besar daripada hutangmu."
                : net < 0
                  ? "Saldo bersih kamu negatif. Kamu memiliki lebih banyak kewajiban pembayaran (hutang) daripada piutang."
                  : "Saldo bersih kamu berimbang."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
