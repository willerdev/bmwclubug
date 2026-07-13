"use client";

import { useState } from "react";
import { LOCAL_IMAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Upload } from "lucide-react";

const PRESET = [
  LOCAL_IMAGES.hero,
  ...LOCAL_IMAGES.events,
  ...LOCAL_IMAGES.products,
  ...LOCAL_IMAGES.m4.slice(0, 3),
  ...LOCAL_IMAGES.cars.slice(0, 3),
];

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImagePicker({ value, onChange, label = "Image" }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm text-white/70">{label}</label>
      {value && (
        <div className="relative h-36 rounded-xl overflow-hidden border border-white/10">
          <Image src={value} alt="" fill className="object-cover" sizes="400px" unoptimized={value.startsWith("/api/media")} />
        </div>
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/images/... or https://..."
        className="w-full px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50"
      />
      <label className="flex items-center justify-center gap-2 px-4 py-3 glass-frosted rounded-xl border border-dashed border-white/20 cursor-pointer hover:border-bmw-blue/40">
        <Upload size={16} />
        <span className="text-sm">{uploading ? "Uploading..." : "Upload image"}</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </label>
      {error && <p className="text-xs text-bmw-red">{error}</p>}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {PRESET.map((src) => (
          <button
            key={src}
            type="button"
            onClick={() => onChange(src)}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden border",
              value === src ? "border-bmw-blue" : "border-white/10"
            )}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>
    </div>
  );
}
