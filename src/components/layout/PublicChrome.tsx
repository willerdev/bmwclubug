"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main className="relative z-10 w-full max-w-full overflow-x-clip">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="relative z-10 w-full max-w-full overflow-x-clip">{children}</main>
      <Footer />
    </>
  );
}
