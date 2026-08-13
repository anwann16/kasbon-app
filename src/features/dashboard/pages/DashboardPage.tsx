"use client";

import { Summary } from "../components/Summary";
import { DeptList } from "../components/DeptList";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Modal } from "../components/DeptModal";
import { useDashboard } from "../hooks/useDashboard";
import { ConfirmModal } from "@/components/shared/ConfirmModal";

const DashboardPage = () => {
  const {
    debts,
    isLoading,
    isModalOpen,
    editingDebt,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleRequestDelete,
    handleConfirmDelete,
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
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="mb-2 text-2xl sm:text-[32px] font-bold tracking-[-.04em]">
            Dashboard
          </h1>
          <p className="mb-6 text-xs sm:text-sm text-[#475569]">
            Kelola catatan hutang piutangmu biar nggak ada yang kelewat.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="mt-2 sm:mt-5 flex items-center gap-2 rounded-[9px] bg-[#009B55] p-3 sm:px-4 sm:py-5 text-sm font-semibold text-white cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Catat Hutang/Piutang</span>
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
        onEdit={handleOpenEdit}
        onDelete={handleRequestDelete}
        onToggle={handleToggleSettled}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleAddSuccess}
        editingDebt={editingDebt}
      />

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Catatan"
        description="Apakah kamu yakin ingin menghapus catatan hutang/piutang ini secara permanen?"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        confirmVariant="destructive"
      />
    </section>
  );
};

export default DashboardPage;
