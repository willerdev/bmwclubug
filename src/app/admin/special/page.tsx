"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";
import {
  AdminFormWizard,
  WizardActions,
  type WizardStep,
} from "@/components/admin/AdminFormWizard";

type SpecialItem = {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt: string;
};

const steps: WizardStep[] = [
  { title: "Details", description: "Add a title and short description for this special feature." },
  { title: "Media", description: "Upload a photo or video to feature in the Special section." },
];

export default function AdminSpecialPage() {
  const [items, setItems] = useState<SpecialItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setItems(await (await fetch("/api/special")).json());
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/special")
      .then((res) => res.json())
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const reset = () => {
    setTitle("");
    setDescription("");
    setMediaUrl("");
    setMediaType("image");
    setEditingId(null);
    setStep(0);
    setMaxVisited(0);
    setError("");
  };

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setMediaUrl(String(data.url));
      setMediaType(String(data.mime || file.type).startsWith("video/") ? "video" : "image");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!mediaUrl) {
      setError("Upload a photo or video before saving.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = { title, description, mediaUrl, mediaType };
    const res = await fetch(editingId ? `/api/special/${editingId}` : "/api/special", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Failed to save special item");
      setSaving(false);
      return;
    }
    setItems(Array.isArray(data) ? data : await (await fetch("/api/special")).json());
    setMessage(editingId ? "Special item updated" : "Special item added");
    reset();
    setSaving(false);
    await load();
  };

  const next = () => {
    setError("");
    setMessage("");
    if (step === 0) {
      if (!title.trim()) {
        setError("Add a title before continuing.");
        return;
      }
      setStep(1);
      setMaxVisited(1);
      return;
    }
    void save();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Special</h1>
        <p className="text-white/50 mt-1 text-sm">
          Feature standout club photos and videos on the public Special page.
        </p>
      </div>

      <GlassCard className="space-y-4" hover={false}>
        <AdminFormWizard steps={steps} current={step} maxVisited={maxVisited} onStepChange={setStep}>
          {step === 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              <AdminField label="Title" className="md:col-span-2">
                <input className={adminInput} value={title} onChange={(e) => setTitle(e.target.value)} />
              </AdminField>
              <AdminField label="Description" className="md:col-span-2">
                <textarea
                  className={adminInput}
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </AdminField>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              {mediaUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/30">
                  {mediaType === "video" ? (
                    <video src={mediaUrl} controls className="w-full h-full object-contain" />
                  ) : (
                    <Image
                      src={mediaUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="600px"
                      unoptimized={mediaUrl.startsWith("/api/media")}
                    />
                  )}
                </div>
              )}
              <label className="flex flex-col items-center justify-center gap-2 px-4 py-8 glass-frosted rounded-xl border border-dashed border-white/20 cursor-pointer hover:border-bmw-blue/40">
                <Upload size={18} />
                <span className="text-sm">
                  {uploading ? "Uploading..." : "Upload photo or video"}
                </span>
                <span className="text-xs text-white/40">Images up to 8MB · Videos up to 40MB</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void upload(file);
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
          )}

          {error && <p className="text-sm text-bmw-red">{error}</p>}
          <WizardActions
            current={step}
            total={steps.length}
            onBack={() => setStep(0)}
            onNext={next}
            onCancel={editingId ? reset : undefined}
            nextLabel={step === 1 ? (editingId ? "Update special" : "Add to Special") : undefined}
            busy={saving || uploading}
          />
        </AdminFormWizard>
      </GlassCard>

      {message && (
        <div className="glass-panel border border-bmw-blue/30 rounded-xl px-4 py-3 text-sm text-bmw-blue-light">
          {message}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <GlassCard key={item.id} className="p-0 overflow-hidden">
            <div className="relative aspect-video bg-black/30">
              {item.mediaType === "video" ? (
                <video src={item.mediaUrl} className="w-full h-full object-cover" muted playsInline />
              ) : (
                <Image
                  src={item.mediaUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="300px"
                  unoptimized={item.mediaUrl.startsWith("/api/media")}
                />
              )}
            </div>
            <div className="p-4 space-y-2">
              <p className="font-medium truncate">{item.title || "Untitled"}</p>
              <p className="text-xs text-white/45 uppercase">{item.mediaType}</p>
              <div className="flex gap-2">
                <AdminButton
                  variant="secondary"
                  onClick={() => {
                    setEditingId(item.id);
                    setTitle(item.title);
                    setDescription(item.description);
                    setMediaUrl(item.mediaUrl);
                    setMediaType(item.mediaType);
                    setStep(0);
                    setMaxVisited(1);
                    setMessage("");
                  }}
                >
                  Edit
                </AdminButton>
                <AdminButton
                  variant="danger"
                  onClick={async () => {
                    await fetch(`/api/special/${item.id}`, { method: "DELETE" });
                    await load();
                  }}
                >
                  Delete
                </AdminButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
