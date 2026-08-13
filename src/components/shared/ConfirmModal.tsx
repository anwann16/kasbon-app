"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive" | "success";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Yakin",
  cancelText = "Batal",
  confirmVariant = "success",
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const btnBg =
    confirmVariant === "success"
      ? "bg-[#009B55] hover:bg-[#007F46]"
      : confirmVariant === "destructive"
        ? "bg-[#D92D3E] hover:bg-[#B91C1C]"
        : "bg-primary hover:bg-primary/90";

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-[#111827]/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-100 rounded-[16px] bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div
            className={`grid size-10 shrink-0 place-items-center rounded-full ${
              confirmVariant === "destructive"
                ? "bg-red-50 text-red-600"
                : "bg-[#EAF8F1] text-[#008A4C]"
            }`}
          >
            <AlertCircle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 leading-6">
              {title}
            </h3>
            <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-[#EEF1F0] pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-[9px] px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F8FAF9] cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-[9px] px-5 py-2 text-sm font-semibold text-white cursor-pointer ${btnBg}`}
          >
            {isLoading ? "Memproses..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
