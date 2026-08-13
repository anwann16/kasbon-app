import { z } from "zod";

export const createDebtSchema = z.object({
  type: z.enum(["owed_to_me", "i_owe"]),

  counterpart_name: z.string().trim().min(1, "Nama orang wajib diisi"),

  amount: z.coerce
    .number({ message: "Nominal harus berupa angka" })
    .int("Jumlah harus berupa bilangan bulat")
    .positive("Jumlah harus lebih dari 0"),

  note: z
    .string()
    .trim()
    .max(200, "Catatan maksimal 200 karakter")
    .optional()
    .nullable(),

  due_date: z.string().optional().nullable(),
});

export const updateDebtSchema = z
  .object({
    type: z.enum(["owed_to_me", "i_owe"]).optional(),

    counterpart_name: z
      .string()
      .trim()
      .min(1, "Nama orang wajib diisi")
      .optional(),

    amount: z
      .number()
      .int("Jumlah harus berupa bilangan bulat")
      .positive("Jumlah harus lebih dari 0")
      .optional(),

    note: z
      .string()
      .trim()
      .max(200, "Catatan maksimal 200 karakter")
      .nullable()
      .optional(),

    due_date: z.string().nullable().optional(),

    settled: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Minimal satu field harus diubah",
  });

export const getDebtsSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["settled", "unsettled"]).optional(),
  type: z.enum(["owed_to_me", "i_owe"]).optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
});

export type GetDebtsInput = z.infer<typeof getDebtsSchema>;
export type CreateDebtInput = z.infer<typeof createDebtSchema>;
export type UpdateDebtInput = z.infer<typeof updateDebtSchema>;
