create type debt_type as enum (
  'owed_to_me',
  'i_owe'
);

create table public.debts (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  type debt_type not null,

  counterpart_name text not null,

  amount bigint not null
    check (amount > 0),

  note text
    check (
      note is null
      or char_length(note) <= 200
    ),

  due_date date,

  settled_at timestamptz,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);