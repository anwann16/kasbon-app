"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginFormData } from "@/lib/schemas/auth.schema";
import { login } from "../service/auth.service";
import { toast } from "sonner";

export function useLogin() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    const { error } = await login(data.email, data.password);

    if (error) {
      setError(error.message);
      return;
    }
    toast.success("Berhasil masuk!");
    router.push("/");
    router.refresh();
  };

  return {
    form,
    onSubmit,
    error,
    isSubmitting: form.formState.isSubmitting,
  };
}
