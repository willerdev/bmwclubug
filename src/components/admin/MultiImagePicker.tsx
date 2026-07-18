"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { LOCAL_IMAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PRESET = [
  LOCAL_IMAGES.hero,
  ...LOCAL_IMAGES.events,
  ...LOCAL_IMAGES.products,
  ...LOCAL_IMAGES.m4,
  ...LOCAL_IMAGES.cars,
];

export function MultiImagePicker({
  value,
  onChange,
  label = "Images",
  max = 30,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  max?: number;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const append = (urls: string[]) => {
    onChange([...new Set([...value, ...urls])].slice(0, max));
  };

  const uploadFiles = async (files: File[]) => {
    const remaining = Math.max(0, max - value.length);
    if (!remaining) return;
    setUploading(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of files.slice(0, remaining)) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/media", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Upload failed: ${file.name}`);
        urls.push(String(data.url));
      }
      append(urls);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-sm text-white/70">{label}</label>
        <span className="text-xs text-white/40">{value.length}/{max}</span>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {value.map((src, index) => (
            <div key={`${src}-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="120px"
                unoptimized={src.startsWith("/api/media")}
              />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/75 flex items-center justify-center"
                aria-label={`Remove image ${index + 1}`}
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {value.length < max && (
        <>
          <label className="flex items-center justify-center gap-2 px-4 py-4 glass-frosted rounded-xl border border-dashed border-white/20 cursor-pointer hover:border-bmw-blue/40">
            <Upload size={16} />
            <span className="text-sm">{uploading ? "Uploading images..." : "Upload multiple images"}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length) void uploadFiles(files);
                e.currentTarget.value = "";
              }}
            />
          </label>

          <div>
            <p className="text-xs text-white/45 mb-2">Or select several existing images</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {PRESET.map((src) => {
                const selected = value.includes(src);
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() =>
                      selected
                        ? onChange(value.filter((item) => item !== src))
                        : append([src])
                    }
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden border-2",
                      selected ? "border-bmw-blue" : "border-white/10"
                    )}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {error && <p className="text-xs text-bmw-red">{error}</p>}
    </div>
  );
}
