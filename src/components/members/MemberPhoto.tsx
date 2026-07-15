"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const FALLBACK = "/images/club-logo.jpeg";

export function memberPhotoSrc(photo?: string | null) {
  const src = (photo || "").trim();
  return src || FALLBACK;
}

export function MemberPhoto({
  src,
  alt,
  className,
  sizes = "96px",
  priority,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const photo = memberPhotoSrc(src);
  return (
    <Image
      src={photo}
      alt={alt}
      fill
      className={cn("object-cover", className)}
      sizes={sizes}
      priority={priority}
      unoptimized={photo.startsWith("/api/media")}
    />
  );
}
