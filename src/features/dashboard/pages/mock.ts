const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

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

export const DEMO_DEBTS: Debt[] = [
  {
    id: "1",
    type: "owed_to_me",
    counterpartName: "Nadine Prameswari",
    amount: 1250000,
    note: "Tiket konser dan makan malam",
    dueDate: "2026-08-20",
    settledAt: null,
    createdAt: daysAgo(1),
  },
  {
    id: "2",
    type: "i_owe",
    counterpartName: "Raka Mahendra",
    amount: 340000,
    note: "Patungan hadiah ulang tahun",
    dueDate: "2026-08-16",
    settledAt: null,
    createdAt: daysAgo(2),
  },
  {
    id: "3",
    type: "owed_to_me",
    counterpartName: "Mira Salsabila",
    amount: 875000,
    note: "Pinjaman sampai akhir bulan",
    dueDate: "2026-08-31",
    settledAt: null,
    createdAt: daysAgo(4),
  },
  {
    id: "4",
    type: "i_owe",
    counterpartName: "Bramantya Adi",
    amount: 180000,
    note: "Kopi dan transport minggu lalu",
    dueDate: "2026-08-12",
    settledAt: daysAgo(1),
    createdAt: daysAgo(9),
  },
  {
    id: "5",
    type: "owed_to_me",
    counterpartName: "Satria Wicaksana",
    amount: 2200000,
    note: "Uang muka sewa kamera",
    dueDate: "2026-09-03",
    settledAt: null,
    createdAt: daysAgo(12),
  },
  {
    id: "6",
    type: "owed_to_me",
    counterpartName: "Tasya Kirana",
    amount: 95000,
    note: "Sarapan kantor",
    dueDate: "2026-08-14",
    settledAt: daysAgo(2),
    createdAt: daysAgo(16),
  },
];
