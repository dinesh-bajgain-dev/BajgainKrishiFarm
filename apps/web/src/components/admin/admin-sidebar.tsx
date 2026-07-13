"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Home,
  Image as ImageIcon,
  Images,
  LayoutDashboard,
  LogOut,
  MailQuestion,
  Menu,
  Phone,
  PiggyBank,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminApiFetch } from "@/lib/api";
import { SITE_NAME } from "@/lib/constants";
import { getAdminDictionary } from "@/lib/admin-i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function useNavItems() {
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale).sidebar;
  return [
    { href: "/admin", label: t.dashboard, icon: LayoutDashboard, exact: true },
    { href: "/admin/pigs", label: t.myPigs, icon: PiggyBank },
    { href: "/admin/gallery", label: t.photoGallery, icon: Images },
    { href: "/admin/inquiries", label: t.messages, icon: MailQuestion },
    { href: "/admin/homepage", label: t.homepage, icon: Home },
    { href: "/admin/about", label: t.aboutPage, icon: BookOpen },
    { href: "/admin/page-banners", label: t.pageBanners, icon: ImageIcon },
    { href: "/admin/farm-info", label: t.farmDetails, icon: Phone },
  ];
}

function AdminNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const navItems = useNavItems();

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      {navItems.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function useAdminLogout() {
  const router = useRouter();
  return async function handleLogout() {
    await adminApiFetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };
}

function LogoutButton() {
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale).sidebar;
  const handleLogout = useAdminLogout();
  return (
    <div className="border-t border-border p-3">
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-foreground/70 hover:bg-muted hover:text-foreground"
      >
        <LogOut className="size-5" />
        {t.logOut}
      </button>
    </div>
  );
}

export function AdminSidebar() {
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale).sidebar;

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="border-b border-border px-5 py-5">
        <Link href="/admin" className="font-heading text-lg font-semibold">
          {SITE_NAME}
        </Link>
        <p className="text-xs text-muted-foreground">{t.subtitle}</p>
      </div>
      <AdminNavLinks />
      <LogoutButton />
    </aside>
  );
}

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale).sidebar;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label={t.openMenu} className="lg:hidden" />}
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="font-heading">{SITE_NAME}</SheetTitle>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </SheetHeader>
        <AdminNavLinks onNavigate={() => setOpen(false)} />
        <LogoutButton />
      </SheetContent>
    </Sheet>
  );
}
