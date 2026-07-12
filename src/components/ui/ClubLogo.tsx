"use client";

import Image from "next/image";
import Link from "next/link";
import { LOCAL_IMAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ClubLogoProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { px: 36, text: "text-xs" },
  md: { px: 44, text: "text-sm" },
  lg: { px: 56, text: "text-base" },
};

export function ClubLogo({ showText = true, size = "md", className }: ClubLogoProps) {
  const s = sizes[size];

  return (
    <Link href="/" className={cn("flex items-center gap-3 group", className)}>
      <div
        className="relative rounded-full overflow-hidden border border-white/20 group-hover:border-bmw-blue/40 transition-colors shrink-0"
        style={{ width: s.px, height: s.px }}
      >
        <Image
          src={LOCAL_IMAGES.logo}
          alt="BMW Club Uganda"
          fill
          className="object-cover"
          sizes={`${s.px}px`}
          priority
        />
      </div>
      {showText && (
        <div className="hidden sm:block">
          <div className={cn("font-bold tracking-wide", s.text)}>BMW CLUB</div>
          <div className="text-xs text-bmw-blue-light tracking-widest">UGANDA</div>
        </div>
      )}
    </Link>
  );
}
