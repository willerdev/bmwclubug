"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";

export default function AdminSettingsPage() {
  const [heroUrl, setHeroUrl] = useState("/images/hero_image.jpeg");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        const hero = data.hero_image;
        if (hero?.url) setHeroUrl(hero.url);
        const contact = data.contact;
        if (contact) {
          setPhone(contact.phone || "");
          setEmail(contact.email || "");
          setLocation(contact.location || "");
        }
      })
      .catch(console.error);
  }, []);

  const save = async () => {
    setMessage("");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hero_image: { url: heroUrl },
        contact: { phone, email, location },
      }),
    });
    setMessage(res.ok ? "Settings saved" : "Failed to save");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold">Hero & Settings</h1>
      <GlassCard className="space-y-4">
        <ImagePicker value={heroUrl} onChange={setHeroUrl} label="Homepage hero image" />
        <AdminField label="Contact phone">
          <input className={adminInput} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </AdminField>
        <AdminField label="Contact email">
          <input className={adminInput} value={email} onChange={(e) => setEmail(e.target.value)} />
        </AdminField>
        <AdminField label="Location">
          <input className={adminInput} value={location} onChange={(e) => setLocation(e.target.value)} />
        </AdminField>
        <AdminButton onClick={save}>Save settings</AdminButton>
        {message && <p className="text-sm text-bmw-blue-light">{message}</p>}
      </GlassCard>
    </div>
  );
}
