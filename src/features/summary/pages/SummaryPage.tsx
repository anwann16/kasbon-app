"use client";

import { Summary } from "../../dashboard/components/Summary";
import { BarChart } from "../components/BarChart";
import { Loader2 } from "lucide-react";
import { useDebt } from "@/features/debts/context/DebtContext";

const SummaryPage = () => {
  const {
    receivable,
    payable,
    net,
    receivedCount,
    owedCount,
    isLoading,
  } = useDebt();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#009B55]" size={40} />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="mb-2 text-[32px] font-bold tracking-[-.04em]">
          Ringkasan
        </h1>
        <p className="mb-6 text-sm text-[#475569]">
          Analisis dan perbandingan catatan hutang piutangmu.
        </p>
      </div>

      <Summary
        receivable={receivable}
        payable={payable}
        net={net}
        receivedCount={receivedCount}
        owedCount={owedCount}
      />

      <BarChart receivable={receivable} payable={payable} net={net} />
    </section>
  );
};

export default SummaryPage;
