import { WalletCards } from "lucide-react";

export const BigLogo = () => {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <div className="relative flex size-10 items-center justify-center rounded-full bg-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.25)]">
        <WalletCards className="size-5 text-white" strokeWidth={2.3} />
      </div>

      <div className="flex items-baseline">
        <span className="text-2xl font-extrabold tracking-tight text-slate-900">
          Kasbon
        </span>
        <span className="text-2xl font-extrabold tracking-tight text-emerald-500">
          App
        </span>
      </div>
    </div>
  );
};
