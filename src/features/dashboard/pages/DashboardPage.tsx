"use client";

import { useState } from "react";
import { Summary } from "../components/Summary";
import { DEMO_DEBTS } from "./mock";
import { TransactionList } from "../components/TransactionList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Modal } from "../components/DeptModal";

const DashboardPage = () => {
  const [debts, setDebts] = useState(DEMO_DEBTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCreate = () => {
    setIsModalOpen(true);
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

  return (
    <section>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2 text-[32px] font-bold tracking-[-.04em]">
            Dashboard
          </h1>
          <p className="mb-6 text-sm text-[#475569]">
            Kelola catatan hutang piutangmu biar nggak ada yang kelewat.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="mt-5 flex items-center gap-2 rounded-[9px] bg-[#009B55] px-4 py-5 text-sm font-semibold text-white cursor-pointer"
        >
          <Plus size={16} />
          Catat Hutang/Piutang
        </Button>
      </div>

      <Summary
        receivable={receivable}
        payable={payable}
        net={net}
        receivedCount={
          debts.filter((debt) => !debt.settledAt && debt.type === "owed_to_me")
            .length
        }
        owedCount={
          debts.filter((debt) => !debt.settledAt && debt.type === "i_owe")
            .length
        }
      />

      <TransactionList
        debts={debts}
        onEdit={() => {}}
        onDelete={(id) => {
          if (window.confirm("Hapus catatan ini?"))
            setDebts((items) => items.filter((item) => item.id !== id));
        }}
        onToggle={(id) =>
          setDebts((items) =>
            items.map((item) =>
              item.id === id
                ? {
                    ...item,
                    settledAt: item.settledAt ? null : new Date().toISOString(),
                  }
                : item,
            ),
          )
        }
        onCreate={handleOpenCreate}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newDebt) => setDebts((prev) => [newDebt, ...prev])}
      />
    </section>
  );
};

export default DashboardPage;
