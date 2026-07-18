"use client";

import { useCallback, useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { MultiImagePicker } from "@/components/admin/MultiImagePicker";
import { MemberPhoto } from "@/components/members/MemberPhoto";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";
import {
  AdminFormWizard,
  WizardActions,
  type WizardStep,
} from "@/components/admin/AdminFormWizard";
import { MEMBERSHIP_LEVELS } from "@/lib/constants";
import { formatMemberTenure } from "@/lib/utils";
import type { Member } from "@/types";

const steps: WizardStep[] = [
  { title: "Information", description: "Add the member's identity and club information." },
  { title: "Photos", description: "Choose a profile photo and build the member gallery." },
  { title: "Review", description: "Review the profile before saving it." },
];

const empty = {
  name: "",
  email: "",
  photo: "",
  bio: "",
  district: "Kampala",
  membershipLevel: "Enthusiast",
  joinedAt: new Date().toISOString().slice(0, 10),
  rank: "Active Member",
  cars: "",
  badges: "",
  awards: "",
  favoriteRoute: "",
  socialInstagram: "",
  socialTwitter: "",
  socialFacebook: "",
  gallery: "",
};

export default function AdminMembersPage() {
  const [items, setItems] = useState<Member[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setItems(await (await fetch("/api/members")).json());
  }, []);
  useEffect(() => {
    let active = true;
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const galleryList = form.gallery
    ? form.gallery.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const save = async () => {
    setError("");
    setSaving(true);
    if (!form.name.trim()) {
      setError("Name is required");
      setSaving(false);
      return;
    }
    const payload = {
      name: form.name,
      email: form.email,
      photo: form.photo,
      bio: form.bio,
      district: form.district,
      membershipLevel: form.membershipLevel,
      joinedAt: form.joinedAt,
      rank: form.rank,
      cars: form.cars,
      badges: form.badges,
      awards: form.awards,
      favoriteRoute: form.favoriteRoute,
      gallery: galleryList,
      social: {
        instagram: form.socialInstagram,
        twitter: form.socialTwitter,
        facebook: form.socialFacebook,
      },
    };
    const res = await fetch(editingId ? `/api/members/${editingId}` : "/api/members", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Failed to save member");
      setSaving(false);
      return;
    }
    setForm(empty);
    setEditingId(null);
    setStep(0);
    setMaxVisited(0);
    setMessage(editingId ? "Member updated successfully" : "Member created successfully");
    setSaving(false);
    await load();
  };

  const resetEditor = () => {
    setForm(empty);
    setEditingId(null);
    setError("");
    setStep(0);
    setMaxVisited(0);
  };

  const next = () => {
    setError("");
    setMessage("");
    if (step === 0) {
      if (!form.name.trim()) {
        setError("Enter the member's name before continuing.");
        return;
      }
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setError("Enter a valid email address.");
        return;
      }
    }
    if (step < steps.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      setMaxVisited((current) => Math.max(current, nextStep));
      return;
    }
    void save();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Members</h1>
        <p className="text-white/50 mt-1 text-sm">
          Profile photos, bio, cars, badges, social links, and gallery all appear on the public member page.
          Tenure is calculated from the joined date.
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
          <AdminField label="Name">
            <input className={adminInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </AdminField>
          <AdminField label="Email">
            <input className={adminInput} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </AdminField>
          <AdminField label="District">
            <input className={adminInput} value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
          </AdminField>
          <AdminField label="Rank">
            <input className={adminInput} value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} />
          </AdminField>
          <AdminField label="Membership level">
            <select className={adminInput} value={form.membershipLevel} onChange={(e) => setForm({ ...form, membershipLevel: e.target.value })}>
              {MEMBERSHIP_LEVELS.map((l) => (
                <option key={l} value={l} className="bg-carbon">
                  {l}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Joined date">
            <input
              type="date"
              className={adminInput}
              value={form.joinedAt}
              onChange={(e) => setForm({ ...form, joinedAt: e.target.value })}
            />
          </AdminField>
          <AdminField label="Cars (comma separated)" className="md:col-span-2">
            <input className={adminInput} value={form.cars} onChange={(e) => setForm({ ...form, cars: e.target.value })} />
          </AdminField>
          <AdminField label="Badges (comma separated)" className="md:col-span-2">
            <input className={adminInput} value={form.badges} onChange={(e) => setForm({ ...form, badges: e.target.value })} placeholder="Road Trip Hero, Founding Member" />
          </AdminField>
          <AdminField label="Awards (comma separated)" className="md:col-span-2">
            <input className={adminInput} value={form.awards} onChange={(e) => setForm({ ...form, awards: e.target.value })} />
          </AdminField>
          <AdminField label="Favorite route" className="md:col-span-2">
            <input className={adminInput} value={form.favoriteRoute} onChange={(e) => setForm({ ...form, favoriteRoute: e.target.value })} />
          </AdminField>
          <AdminField label="Instagram URL">
            <input className={adminInput} value={form.socialInstagram} onChange={(e) => setForm({ ...form, socialInstagram: e.target.value })} placeholder="https://instagram.com/..." />
          </AdminField>
          <AdminField label="Twitter / X URL">
            <input className={adminInput} value={form.socialTwitter} onChange={(e) => setForm({ ...form, socialTwitter: e.target.value })} />
          </AdminField>
          <AdminField label="Facebook URL" className="md:col-span-2">
            <input className={adminInput} value={form.socialFacebook} onChange={(e) => setForm({ ...form, socialFacebook: e.target.value })} />
          </AdminField>
          <AdminField label="Bio" className="md:col-span-2">
            <textarea className={adminInput} rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </AdminField>
        </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <ImagePicker
              value={form.photo}
              onChange={(photo) => setForm({ ...form, photo })}
              label="Profile photo"
            />
            <MultiImagePicker
              value={galleryList}
              onChange={(gallery) => setForm({ ...form, gallery: gallery.join(", ") })}
              label="Member gallery"
              max={30}
            />
          </div>
        )}

        {step === 2 && (
          <div className="grid md:grid-cols-[160px_1fr] gap-6 items-start">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10">
              <MemberPhoto src={form.photo} alt={form.name || "Member"} sizes="160px" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-bmw-blue-light">
                  {form.membershipLevel}
                </p>
                <h3 className="text-2xl font-bold mt-1">{form.name || "Unnamed member"}</h3>
                <p className="text-sm text-white/50 mt-1">
                  {form.rank} · {form.district}
                </p>
              </div>
              {form.bio && <p className="text-sm text-white/65 leading-relaxed">{form.bio}</p>}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="glass-frosted rounded-xl p-3">
                  <p className="text-lg font-bold text-bmw-blue">{galleryList.length}</p>
                  <p className="text-[10px] text-white/40 uppercase">Gallery photos</p>
                </div>
                <div className="glass-frosted rounded-xl p-3">
                  <p className="text-lg font-bold text-bmw-blue">
                    {form.cars.split(",").filter((car) => car.trim()).length}
                  </p>
                  <p className="text-[10px] text-white/40 uppercase">Cars</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-bmw-red">{error}</p>}
        <WizardActions
          current={step}
          total={steps.length}
          onBack={() => setStep((current) => Math.max(0, current - 1))}
          onNext={next}
          onCancel={editingId ? resetEditor : undefined}
          nextLabel={
            step === steps.length - 1
              ? editingId
                ? "Update member"
                : "Create member"
              : undefined
          }
          busy={saving}
        />
        </AdminFormWizard>
      </GlassCard>

      {message && (
        <div className="glass-panel border border-bmw-blue/30 rounded-xl px-4 py-3 text-sm text-bmw-blue-light">
          {message}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const tenure = formatMemberTenure(item.joinedAt);
          return (
            <GlassCard key={item.id}>
              <div className="flex gap-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                  <MemberPhoto src={item.photo} alt={item.name} className="rounded-full" sizes="56px" />
                </div>
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-xs text-bmw-blue">{item.membershipLevel}</p>
                  <p className="text-xs text-white/50">{item.district}</p>
                  <p className="text-xs text-white/40 mt-1">{tenure.long}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <AdminButton
                  variant="secondary"
                  onClick={() => {
                    setEditingId(item.id);
                    setStep(0);
                    setMaxVisited(2);
                    setMessage("");
                    setError("");
                    setForm({
                      name: item.name,
                      email: item.email,
                      photo: item.photo,
                      bio: item.bio,
                      district: item.district,
                      membershipLevel: item.membershipLevel,
                      joinedAt: item.joinedAt || new Date().toISOString().slice(0, 10),
                      rank: item.rank,
                      cars: (item.cars || []).join(", "),
                      badges: (item.badges || []).join(", "),
                      awards: (item.awards || []).join(", "),
                      favoriteRoute: item.favoriteRoute,
                      socialInstagram: item.social?.instagram || "",
                      socialTwitter: item.social?.twitter || "",
                      socialFacebook: item.social?.facebook || "",
                      gallery: (item.gallery || []).join(", "),
                    });
                  }}
                >
                  Edit
                </AdminButton>
                <AdminButton
                  variant="danger"
                  onClick={async () => {
                    await fetch(`/api/members/${item.id}`, { method: "DELETE" });
                    await load();
                  }}
                >
                  Delete
                </AdminButton>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
