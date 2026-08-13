"use client";

import { Summary } from "../components/Summary";
import { DeptList } from "../components/DeptList";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Modal } from "../components/DeptModal";
import { useDashboard } from "../hooks/useDashboard";

const DashboardPage = () => {
  const {
    debts,
    setDebts,
    isLoading,
    isModalOpen,
    handleOpenCreate,
    handleCloseModal,
    handleToggleSettled,
    handleAddSuccess,
    receivable,
    payable,
    net,
    receivedCount,
    owedCount,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#009B55]" size={40} />
      </div>
    );
  }

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
        receivedCount={receivedCount}
        owedCount={owedCount}
      />

      <DeptList
        debts={debts}
        onEdit={() => {}}
        onDelete={(id) => {
          if (window.confirm("Hapus catatan ini?"))
            setDebts((items) => items.filter((item) => item.id !== id));
        }}
        onToggle={handleToggleSettled}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleAddSuccess}
      />
    </section>
  );
};

export default DashboardPage;
