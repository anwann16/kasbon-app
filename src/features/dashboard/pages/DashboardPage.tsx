"use client";

import { useState } from "react";
import { Summary } from "../components/Summary";
import { DEMO_DEBTS } from "./mock";
import { TransactionList } from "../components/TransactionList";

const DashboardPage = () => {
  const [debts, setDebts] = useState(DEMO_DEBTS);

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
      <h1 className="mb-2 text-[32px] font-bold tracking-[-.04em]">
        Dashboard
      </h1>
      <p className="mb-6 text-sm text-[#475569]">
        Kelola catatan hutang piutangmu biar nggak ada yang kelewat.
      </p>
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
                    settledAt: item.settledAt
                      ? null
                      : new Date().toISOString(),
                  }
                : item,
            ),
          )
        }
        onCreate={() => {}}
      />
    </section>
  );
};

export default DashboardPage;
