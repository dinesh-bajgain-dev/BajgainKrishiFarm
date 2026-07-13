"use client";

import { usePathname } from "next/navigation";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminLanguageToggle } from "@/components/admin/admin-language-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex h-14 items-center justify-between border-b border-border px-4 sm:px-6">
          <AdminMobileNav />
          <div className="flex-1" />
          <AdminLanguageToggle className="mr-1.5" />
          <ThemeToggle />
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
