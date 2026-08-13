export type DebtType = "owed_to_me" | "i_owe";
export type DebtStatusFilter = "semua" | "belum" | "lunas";
export type DebtSort = "newest" | "oldest" | "highest" | "lowest";

export type Debt = {
  id: string;
  type: DebtType;
  counterpartName: string;
  amount: number;
  note: string;
  dueDate: string;
  settledAt: string | null;
  createdAt: string;
};

export type DebtDraft = Pick<
  Debt,
  "type" | "counterpartName" | "amount" | "note" | "dueDate"
>;
