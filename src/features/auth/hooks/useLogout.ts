"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../service/auth.service";
import { toast } from "sonner";

export function useLogout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const { error } = await logout();
      if (error) {
        toast.error(error.message || "Gagal keluar. Silakan coba lagi.");
        return;
      }
      toast.success("Berhasil keluar!");
      router.push("/login");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat keluar.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogout,
    isLoading,
  };
}
