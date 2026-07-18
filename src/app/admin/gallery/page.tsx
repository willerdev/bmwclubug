"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { MultiImagePicker } from "@/components/admin/MultiImagePicker";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";
import {
  AdminFormWizard,
  WizardActions,
  type WizardStep,
} from "@/components/admin/AdminFormWizard";

type Item = { id: string; image: string; category: string; title: string };

const steps: WizardStep[] = [
  { title: "Information", description: "Describe and categorize the gallery entry." },
  { title: "Images", description: "Upload or select one or several gallery images." },
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState({ category: "Cars", title: "" });
  const [images, setImages] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setItems(await (await fetch("/api/gallery")).json());
  }, []);
  useEffect(() => {
    let active = true;
    fetch("/api/gallery")
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
    setForm({ category: "Cars", title: "" });
    setImages([]);
    setEditingId(null);
    setStep(0);
    setMaxVisited(0);
    setError("");
  };

  const save = async () => {
    if (!images.length) {
      setError("Add at least one image.");
      return;
    }
    setSaving(true);
    setError("");
    const queue = [...images];
    if (editingId) {
      const first = queue.shift();
      const res = await fetch(`/api/gallery/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: first }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to update gallery item");
        setSaving(false);
        return;
      }
    }
    for (const image of queue) {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Some gallery images could not be saved");
        setSaving(false);
        return;
      }
    }
    setMessage(editingId ? "Gallery entry updated" : `${images.length} image${images.length === 1 ? "" : "s"} added`);
    reset();
    setSaving(false);
    await load();
  };

  const next = () => {
    setError("");
    setMessage("");
    if (step === 0) {
      if (!form.title.trim()) {
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
        <h1 className="text-3xl font-bold">Gallery</h1>
        <p className="text-white/50 mt-1 text-sm">
          Add or edit gallery content with a guided information and image workflow.
        </p>
      </div>
      <GlassCard className="space-y-4" hover={false}>
        <AdminFormWizard
          steps={steps}
          current={step}
          maxVisited={maxVisited}
          onStepChange={setStep}
        >
        {step === 0 && (
          <div className="grid md:grid-cols-2 gap-4">
          <AdminField label="Title"><input className={adminInput} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></AdminField>
          <AdminField label="Category">
            <select className={adminInput} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {["Events", "Cars", "Road Trips", "Members", "Videos"].map((c) => (
                <option key={c} value={c} className="bg-carbon">{c}</option>
              ))}
            </select>
          </AdminField>
          </div>
        )}
        {step === 1 && (
          <MultiImagePicker
            value={images}
            onChange={setImages}
            label={editingId ? "Replace image or add more images" : "Gallery images"}
            max={30}
          />
        )}
        {error && <p className="text-sm text-bmw-red">{error}</p>}
        <WizardActions
          current={step}
          total={steps.length}
          onBack={() => setStep(0)}
          onNext={next}
          onCancel={editingId ? reset : undefined}
          nextLabel={step === 1 ? (editingId ? "Update gallery" : "Add to gallery") : undefined}
          busy={saving}
        />
        </AdminFormWizard>
      </GlassCard>
      {message && (
        <div className="glass-panel border border-bmw-blue/30 rounded-xl px-4 py-3 text-sm text-bmw-blue-light">
          {message}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item) => (
          <GlassCard key={item.id} className="p-0 overflow-hidden">
            <div className="relative aspect-square">
              <Image src={item.image} alt="" fill className="object-cover" sizes="200px" unoptimized={item.image?.startsWith("/api/media")} />
            </div>
            <div className="p-3 space-y-2">
              <div className="min-w-0">
                <p className="text-xs truncate">{item.title || item.category}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <AdminButton
                  variant="secondary"
                  onClick={() => {
                    setEditingId(item.id);
                    setForm({ title: item.title, category: item.category });
                    setImages([item.image]);
                    setStep(0);
                    setMaxVisited(1);
                    setMessage("");
                  }}
                >
                  Edit
                </AdminButton>
                <AdminButton variant="danger" onClick={async () => { await fetch(`/api/gallery/${item.id}`, { method: "DELETE" }); await load(); }}>Delete</AdminButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
