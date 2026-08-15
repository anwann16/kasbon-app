import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import {
  CreateDebtInput,
  createDebtSchema,
  getDebtsSchema,
} from "@/lib/schemas/debt.schema";
import { errorResponse, successResponse } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return errorResponse("Kamu harus login terlebih dahulu", 401);
    }
    const body: CreateDebtInput = await request.json();
    const result = createDebtSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(
        "Data yang dikirim tidak valid",
        400,
        result.error.flatten().fieldErrors,
      );
    }
    const { data: debt, error } = await supabase
      .from("debts")
      .insert({
        user_id: user.id,
        type: result.data.type,
        counterpart_name: result.data.counterpart_name,
        amount: result.data.amount,
        note: result.data.note ?? null,
        due_date: result.data.due_date ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return successResponse(debt, "Catatan utang berhasil dibuat", 201);
  } catch (error) {
    return errorResponse("Gagal membuat catatan utang", 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse("Kamu harus login terlebih dahulu", 401);
    }

    const rawParams = Object.fromEntries(
      request.nextUrl.searchParams.entries(),
    );

    const result = getDebtsSchema.safeParse(rawParams);

    if (!result.success) {
      return errorResponse(
        "Parameter filter tidak valid",
        400,
        result.error.flatten().fieldErrors,
      );
    }

    const { search, status, type, sort } = result.data;
    let query = supabase.from("debts").select("*").eq("user_id", user.id);

    if (search) {
      query = query.ilike("counterpart_name", `%${search}%`);
    }

    if (status === "settled") {
      query = query.not("settled_at", "is", null);
    }
    if (status === "unsettled") {
      query = query.is("settled_at", null);
    }
    if (type) {
      query = query.eq("type", type);
    }
    if (sort === "highest" || sort === "lowest") {
      query = query.order("amount", {
        ascending: sort === "lowest",
      });
    } else {
      query = query.order("created_at", {
        ascending: sort === "oldest",
      });
    }

    const { data, error } = await query;

    if (error) {
      return errorResponse("Gagal mengambil data utang", 500);
    }

    return successResponse(data, "Data utang berhasil diambil");
  } catch (error) {
    return errorResponse("Gagal mengambil data utang", 500);
  }
}
