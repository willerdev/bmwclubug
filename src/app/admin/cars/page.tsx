"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { MultiImagePicker } from "@/components/admin/MultiImagePicker";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";
import { MAX_CAR_IMAGES } from "@/lib/media-limits";

type Car = {
  id: string;
  name: string;
  generation: string;
  year: string;
  engine: string;
  horsepower: number;
  owner: string;
  description: string;
  sortOrder: number;
  isPublished: boolean;
  images: string[];
  image: string;
};

const empty = {
  name: "",
  generation: "",
  year: "",
  engine: "",
  horsepower: 0,
  owner: "",
  description: "",
  sortOrder: 0,
  isPublished: true,
  images: [] as string[],
};

export default function AdminCarsPage() {
  const [items, setItems] = useState<Car[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/cars");
    if (res.ok) setItems(await res.json());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    setError("");
    if (!form.name.trim()) {
      setError("Car name is required");
      return;
    }
    if (form.images.length === 0) {
      setError(`Add at least one picture (up to ${MAX_CAR_IMAGES})`);
      return;
    }
    const res = await fetch(editingId ? `/api/cars/${editingId}` : "/api/cars", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Failed to save car");
      return;
    }
    setForm(empty);
    setEditingId(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Slideshow Cars</h1>
        <p className="text-white/50 mt-1 text-sm">
          Add featured BMWs for the homepage carousel. Up to {MAX_CAR_IMAGES} pictures per car.
        </p>
      </div>

      <GlassCard className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <AdminField label="Name">
            <input className={adminInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="M4 / F30 330i" />
          </AdminField>
          <AdminField label="Generation">
            <input className={adminInput} value={form.generation} onChange={(e) => setForm({ ...form, generation: e.target.value })} placeholder="G82" />
          </AdminField>
          <AdminField label="Year">
            <input className={adminInput} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2021-Present" />
          </AdminField>
          <AdminField label="Engine">
            <input className={adminInput} value={form.engine} onChange={(e) => setForm({ ...form, engine: e.target.value })} />
          </AdminField>
          <AdminField label="Horsepower">
            <input
              className={adminInput}
              type="number"
              value={form.horsepower}
              onChange={(e) => setForm({ ...form, horsepower: Number(e.target.value) })}
            />
          </AdminField>
          <AdminField label="Owner">
            <input className={adminInput} value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
          </AdminField>
          <AdminField label="Sort order">
            <input
              className={adminInput}
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            />
          </AdminField>
          <label className="flex items-center gap-2 text-sm text-white/70 self-end pb-2">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            />
            Published on homepage
          </label>
          <AdminField label="Description" className="md:col-span-2">
            <textarea className={adminInput} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </AdminField>
        </div>

        <MultiImagePicker
          value={form.images}
          onChange={(images) => {
            setForm({ ...form, images });
            setError("");
          }}
          label="Car showcase pictures"
          max={MAX_CAR_IMAGES}
        />

        {error && <p className="text-sm text-bmw-red">{error}</p>}
        <div className="flex gap-2">
          <AdminButton onClick={save}>{editingId ? "Update car" : "Add car"}</AdminButton>
          {editingId && (
            <AdminButton
              variant="secondary"
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
            >
              Cancel
            </AdminButton>
          )}
        </div>
      </GlassCard>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((car) => (
          <GlassCard key={car.id} className="p-0 overflow-hidden">
            <div className="relative h-40">
              <Image
                src={car.image || "/images/m4.jpeg"}
                alt={car.name}
                fill
                className="object-cover"
                sizes="300px"
                unoptimized={car.image?.startsWith("/api/media")}
              />
              <div className="absolute top-2 left-2 glass px-2 py-1 rounded-full text-[10px]">
                {(car.images?.length || 0)} pics
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold">{car.name}</h3>
              <p className="text-xs text-white/50">{car.generation} · {car.year}</p>
              <p className="text-xs text-white/40 mt-1">Owner: {car.owner || "—"}</p>
              <div className="flex gap-2 mt-3">
                <AdminButton
                  variant="secondary"
                  onClick={() => {
                    setEditingId(car.id);
                    setForm({
                      name: car.name,
                      generation: car.generation,
                      year: car.year,
                      engine: car.engine,
                      horsepower: car.horsepower,
                      owner: car.owner,
                      description: car.description,
                      sortOrder: car.sortOrder,
                      isPublished: car.isPublished,
                      images: car.images || [],
                    });
                  }}
                >
                  Edit
                </AdminButton>
                <AdminButton
                  variant="danger"
                  onClick={async () => {
                    await fetch(`/api/cars/${car.id}`, { method: "DELETE" });
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
