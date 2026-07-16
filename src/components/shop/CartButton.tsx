"use client";

import { useCart } from "@/providers/CartProvider";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function CartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center w-10 h-10 glass-panel rounded-full border border-white/15 hover:border-bmw-blue/40 transition-colors"
      aria-label={`Cart${count > 0 ? `, ${count} items` : ""}`}
    >
      <ShoppingBag size={18} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-bmw-red text-[10px] font-bold flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
