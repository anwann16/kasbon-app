import { NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse } from "@/lib/api/response";

import { UpdateDebtInput, updateDebtSchema } from "@/lib/schemas/debt.schema";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse("Kamu harus login terlebih dahulu", 401);
    }

    const { id } = await context.params;

    if (!id) {
      return errorResponse("ID catatan utang wajib diisi", 400);
    }

    const body: UpdateDebtInput = await request.json();
    const result = updateDebtSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(
        "Data yang dikirim tidak valid",
        400,
        result.error.flatten().fieldErrors,
      );
    }

    const input = result.data;

    const updateData: Record<string, unknown> = {};

    if (input.type !== undefined) {
      updateData.type = input.type;
    }

    if (input.counterpart_name !== undefined) {
      updateData.counterpart_name = input.counterpart_name;
    }

    if (input.amount !== undefined) {
      updateData.amount = input.amount;
    }

    if (input.note !== undefined) {
      updateData.note = input.note;
    }

    if (input.due_date !== undefined) {
      updateData.due_date = input.due_date;
    }

    if (input.settled !== undefined) {
      updateData.settled_at = input.settled ? new Date().toISOString() : null;
    }
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("debts")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return errorResponse("Catatan utang tidak ditemukan", 404);
    }
    return successResponse(data, "Catatan utang berhasil diperbarui");
  } catch (error) {
    console.error("PATCH /api/debts/:id:", error);

    return errorResponse("Gagal memperbarui catatan utang", 500);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse("Kamu harus login terlebih dahulu", 401);
    }

    const { id } = await context.params;

    if (!id) {
      return errorResponse("ID catatan utang wajib diisi", 400);
    }

    const { error } = await supabase
      .from("debts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return errorResponse("Gagal menghapus catatan utang", 400);
    }

    return successResponse(null, "Catatan utang berhasil dihapus");
  } catch (error) {
    console.error("DELETE /api/debts/:id:", error);
    return errorResponse("Gagal menghapus catatan utang", 500);
  }
}

