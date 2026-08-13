import { createClient } from "@/lib/supabase/client";

export async function login(email: string, password: string) {
  const supabase = createClient();

  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signup(email: string, password: string) {
  const supabase = createClient();

  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function logout() {
  const supabase = createClient();

  return await supabase.auth.signOut();
}
