alter table public.debts enable row level security;

create policy "Users can view own debts"
on public.debts
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create own debts"
on public.debts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own debts"
on public.debts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own debts"
on public.debts
for delete
to authenticated
using (auth.uid() = user_id);