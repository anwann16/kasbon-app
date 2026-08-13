"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { signupSchema, type SignupFormData } from "@/lib/schemas/auth.schema";

import { signup } from "../service/auth.service";

export function useSignup() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);

    const { error } = await signup(data.email, data.password);

    if (error) {
      setError(error.message);
      return;
    }

    toast.success("Akun berhasil dibuat! Silakan masuk.");
    router.push("/login");
  };

  return {
    form,
    onSubmit,
    error,
    isSubmitting: form.formState.isSubmitting,
  };
}
