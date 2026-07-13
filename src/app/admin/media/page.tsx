"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdminButton } from "@/components/admin/AdminUi";
import { Upload } from "lucide-react";

type MediaItem = { id: string; filename: string; mime: string; url: string };

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setItems(await (await fetch("/api/admin/media")).json());
  }, []);
  useEffect(() => { void load(); }, [load]);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      await fetch("/api/admin/media", { method: "POST", body: form });
      await load();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Media Library</h1>
      <GlassCard>
        <label className="flex flex-col items-center justify-center gap-3 py-10 border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-bmw-blue/40">
          <Upload />
          <span>{uploading ? "Uploading..." : "Upload image"}</span>
          <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }} />
        </label>
      </GlassCard>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <GlassCard key={item.id} className="p-0 overflow-hidden">
            <div className="relative aspect-square">
              <Image src={item.url} alt={item.filename} fill className="object-cover" sizes="200px" unoptimized />
            </div>
            <div className="p-3">
              <p className="text-xs truncate">{item.filename}</p>
              <p className="text-[10px] text-white/40 mt-1 break-all">{item.url}</p>
              <AdminButton variant="secondary" onClick={() => navigator.clipboard.writeText(item.url)}>Copy URL</AdminButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
