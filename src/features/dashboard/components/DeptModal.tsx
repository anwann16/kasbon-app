import { X, Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { useDebtForm } from "@/features/debts/hooks/useDebtForm";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Debt } from "@/features/debts/types/debt";

import { useDebt } from "@/features/debts/context/DebtContext";

export function Modal() {
  const {
    isModalOpen: isOpen,
    handleCloseModal: onClose,
    handleAddSuccess: onSuccess,
    editingDebt,
  } = useDebt();

  const { form, onSubmit, error, isSubmitting } = useDebtForm({
    editingDebt,
    onSuccess: (newDebt) => {
      onSuccess(newDebt);
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-[#111827]/30 p-4">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-130 overflow-auto rounded-[15px] bg-white p-5 shadow-xl sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              {editingDebt ? "Ubah detail hutang/piutang" : "Catat hutang/piutang"}
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              {editingDebt ? "Ubah catatan hutang/piutang" : "Catat hutang/piutang baru"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="grid size-9 place-items-center rounded-lg text-[#64748B] hover:bg-[#F8FAF9] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit as any)} className="mt-5">
          <FieldGroup className="gap-3.5">
            {error && (
              <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Tipe</FieldLabel>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="radio"
                        name="type"
                        value="owed_to_me"
                        checked={field.value === "owed_to_me"}
                        onChange={() => field.onChange("owed_to_me")}
                        className="size-4 accent-[#009B55] cursor-pointer"
                      />
                      <span className="text-sm text-[#475569]">
                        Dihutang ke saya
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="radio"
                        name="type"
                        value="i_owe"
                        checked={field.value === "i_owe"}
                        onChange={() => field.onChange("i_owe")}
                        className="size-4 accent-[#D92D3E] cursor-pointer"
                      />
                      <span className="text-sm text-[#475569]">
                        Saya hutang
                      </span>
                    </label>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="counterpart_name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="counterpart_name">Nama Orang</FieldLabel>
                  <Input
                    {...field}
                    id="counterpart_name"
                    placeholder="Masukkan nama orang..."
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="amount"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="amount">Nominal</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="amount"
                    type="number"
                    placeholder="Rp 0"
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? "" : Number(val));
                    }}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="note"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="note">Deskripsi</FieldLabel>
                  <textarea
                    {...field}
                    value={field.value || ""}
                    id="note"
                    maxLength={200}
                    className="min-h-20 w-full resize-none rounded-[9px] border border-[#E5E7EB] p-3 text-sm outline-none focus:border-[#009B55] aria-invalid:border-destructive"
                    placeholder="Makan siang..."
                    aria-invalid={fieldState.invalid}
                  />
                  <div className="flex justify-between mt-1 text-xs">
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <span></span>
                    )}
                    <span className="text-[#64748B]">
                      {(field.value || "").length}/200
                    </span>
                  </div>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="due_date"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="due_date">Jatuh Tempo</FieldLabel>
                  <input
                    {...field}
                    value={field.value || ""}
                    id="due_date"
                    type="date"
                    className="h-11 w-full rounded-[9px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#009B55]"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex justify-end gap-2 border-t border-[#EEF1F0] pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-[9px] px-4 py-2.5 text-sm font-semibold text-[#475569] hover:bg-[#F8FAF9] cursor-pointer"
              >
                Batal
              </button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-[9px] bg-[#009B55] hover:bg-[#007F46] px-5 py-2.5 text-sm font-semibold text-white"
              >
                {isSubmitting && (
                  <Loader2 className="animate-spin mr-1" size={16} />
                )}
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
