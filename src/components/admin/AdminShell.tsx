"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity, BookOpen, Calendar, Car, GalleryVerticalEnd, Home, Image as ImageIcon, LayoutDashboard,
  LogOut, Settings, Shield, ShoppingBag, Store, UserCog, Users, Wrench,
} from "lucide-react";
import { ClubLogo } from "@/components/ui/ClubLogo";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Perm = "view" | "add" | "update" | "all" | "blogger";

const FULL_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/event-registrations", label: "Event Signups", icon: Shield },
  { href: "/admin/cars", label: "Slideshow Cars", icon: Car },
  { href: "/admin/partners", label: "Partners", icon: Store },
  { href: "/admin/garages", label: "Garages", icon: Wrench },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/applications", label: "Join Applications", icon: Users },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/gallery", label: "Gallery", icon: GalleryVerticalEnd },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/users", label: "Staff Users", icon: UserCog },
  { href: "/admin/activity", label: "Activity", icon: Activity },
  { href: "/admin/settings", label: "Hero & Settings", icon: Settings },
] as const;

const BLOGGER_NAV = [
  { href: "/admin/blog", label: "My Blog Posts", icon: BookOpen },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [permission, setPermission] = useState<Perm | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("/api/admin/login")
      .then((r) => r.json())
      .then((data) => {
        const perm = data.user?.permission as Perm | undefined;
        setPermission(perm ?? null);
        setName(data.user?.name || data.user?.email || "");
        if (perm === "blogger" && pathname === "/admin") {
          router.replace("/admin/blog");
        }
      })
      .catch(() => undefined);
  }, [pathname, router]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const nav = permission === "blogger" ? BLOGGER_NAV : FULL_NAV;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 glass-frosted sticky top-0 h-screen">
        <div className="p-5 border-b border-white/10 space-y-3">
          <ClubLogo size="sm" />
          <p className="text-xs text-bmw-blue-light tracking-widest uppercase">
            {permission === "blogger" ? "Blogger CMS" : "Admin CMS"}
          </p>
          {name && <p className="text-xs text-white/45 truncate">{name}</p>}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm glass-panel border border-bmw-blue/30 text-white hover:bg-white/10 w-full justify-center"
          >
            <Home size={15} className="text-bmw-blue-light" /> Home
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                  active ? "glass-panel text-white border border-bmw-blue/30" : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={16} className={active ? "text-bmw-blue-light" : ""} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-2">
          <Link href="/blog" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5">
            <BookOpen size={16} /> View blog
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm glass-panel border border-bmw-blue/25 text-white hover:bg-white/10"
          >
            <Home size={16} className="text-bmw-blue-light" /> Home
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="lg:hidden sticky top-0 z-30 glass-strong border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3">
          <ClubLogo size="sm" showText={false} />
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-bmw-blue-light">
              <Home size={14} /> Home
            </Link>
            <button onClick={logout} className="text-sm text-white/60">Logout</button>
          </div>
        </div>
        <div className="lg:hidden overflow-x-auto border-b border-white/10 px-3 py-2 flex gap-2">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "whitespace-nowrap px-3 py-1.5 rounded-full text-xs border",
                pathname === href || (href !== "/admin" && pathname.startsWith(href))
                  ? "border-bmw-blue/40 bg-white/10"
                  : "border-white/10 text-white/60"
              )}
            >
              {label}
            </Link>
          ))}
        </div>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
