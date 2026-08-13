# Kasbon App

Aplikasi pencatatan dan pengelolaan utang piutang (kasbon) sederhana, responsif, dan premium, dibangun menggunakan Next.js, TailwindCSS, TypeScript, dan terintegrasi dengan database Supabase.

---

## 1. Setup

### Environment Variables

Buat file `.env.local` pada direktori root project dan isi dengan variabel berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

### Cara Migrate Database

Skema tabel database terletak di folder `supabase/migrations/`. Kamu dapat melakukan migrasi dengan dua cara:

1. **Menggunakan Supabase CLI**:
   Jalankan perintah berikut di terminal:

   ```bash
   supabase db push
   ```

2. **Manual via Dashboard Supabase**:
   Salin konten SQL di folder `supabase/migrations/`
   Lalu tempelkan dan jalankan secara berurutan di dalam menu **SQL Editor** pada dashboard proyek Supabase Anda.

### Cara Menjalankan Project secara Lokal

Gunakan Bun (runtime manager default proyek ini) untuk menjalankan server lokal:

```bash
# 1. Install dependencies
bun install

# 2. Jalankan server development
bun run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda untuk melihat hasilnya.

---

## 2. Demo

Aplikasi dideploy dan dapat diakses langsung melalui link berikut:
👉 **[https://kasbon-app-demo.vercel.app](https://kasbon-app-demo.vercel.app)**

---

## 3. Approach (Pendekatan Teknis)

Keputusan teknis yang paling saya banggakan dalam proyek ini adalah memisahkan seluruh logika bisnis (seperti penanganan state lokal, pemanggilan API service, formatting data, hingga kalkulasi agregat nominal rasio saldo) dari layer komponen visual UI ke dalam custom hooks terpisah (seperti `useDashboard`, `useDeptList`, `useLogout`, dll). Dengan pendekatan ini, file komponen Next.js (seperti `DashboardPage`, `DeptList`, `Sidebar`) tetap bersih dan hanya fokus menangani tata letak layout serta styling CSS. Selain membuat struktur kode jauh lebih bersih dan rapi, pemisahan modular ini sangat mempermudah proses pemeliharaan kode (maintenance) dan pengujian (testing) karena logika terisolasi penuh dari siklus rendering UI.

---

## 4. Trade-off (Rencana Pengembangan Lanjutan)

Jika saya memiliki tambahan waktu 1 hari lagi, mungkin saya ingin mengintegrasikan ke ai agar bisa menambah catatan hutang/piutang dengan input chat, tanpa perlu mengisi form secara manual.

---

## 5. Time Spent (Alokasi Waktu Kerja)

Total waktu yang dihabiskan untuk menyelesaikan seluruh implementasi dan pembersihan fitur ini adalah **sekitar 13 jam** (meliputi proses perbaikan layout mobile & desktop, integrasi API hook, setup form control & zod schemas validation, perbaikan bug numerik input, integrasi konfirmasi status lunas, penambahan fitur delete database, pembuatan halaman Ringkasan baru beserta grafik bar chart, serta perapian penamaan komponen dan deploy ke vercel).
