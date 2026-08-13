import { MobileNav, Sidebar } from "../../components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <Sidebar />
      <div className="md:pl-65">
        <main className="mx-auto w-full max-w-350 px-4 pb-24 pt-6 md:px-8 md:pb-10">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
