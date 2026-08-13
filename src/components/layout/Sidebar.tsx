"use client";

import { LayoutDashboard, BarChart3, LogOut } from "lucide-react";
import { BigLogo } from "../shared/Logo";
import { useLogout } from "@/features/auth/hooks/useLogout";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const navItems = [
  ["Dashboard", LayoutDashboard, "/dashboard"],
  ["Ringkasan", BarChart3, "/ringkasan"],
] as const;

export const Sidebar = () => {
  const { handleLogout, isLoading } = useLogout();
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-[#EEF1F0] bg-white px-4 py-6 md:fixed md:inset-y-0 md:left-0 md:w-65 md:flex md:flex-col">
      <div className="mb-12 flex items-start gap-2 px-2">
        <div className="flex h-16 items-center border-b border-slate-100 px-5">
          <BigLogo />
        </div>
      </div>
      <nav className="space-y-1">
        {navItems.map(([label, Icon, href]) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex h-11 w-full items-center gap-3 rounded-[10px] px-3 text-sm font-medium transition ${
                isActive
                  ? "bg-[#EFF8F4] text-[#008A4C]"
                  : "text-[#475569] hover:bg-[#F8FAF9]"
              }`}
            >
              <Icon size={19} />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="mt-auto flex h-11 w-full items-center gap-3 rounded-[10px] px-3 text-sm font-medium text-[#EF4444] hover:bg-[#FEE2E2] transition cursor-pointer disabled:opacity-50"
      >
        <LogOut size={19} />
        <span className="font-semibold text-base">
          {isLoading ? "Keluar..." : "Keluar"}
        </span>
      </button>
    </aside>
  );
};

export const MobileNav = () => {
  const { handleLogout, isLoading } = useLogout();
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-[#E5E7EB] bg-white px-1 py-2 md:hidden">
      {navItems.slice(0, 4).map(([label, Icon, href]) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            className={`flex min-h-11 flex-1 flex-col items-center justify-center gap-1 text-[10px] transition ${
              isActive ? "font-semibold text-[#009B55]" : "text-[#64748B]"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="flex min-h-11 flex-1 flex-col items-center justify-center gap-1 text-[10px] text-[#EF4444] disabled:opacity-50 cursor-pointer"
      >
        <LogOut size={18} />
        {isLoading ? "Keluar..." : "Keluar"}
      </button>
    </nav>
  );
};
