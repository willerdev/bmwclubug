"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50";

export function EventRegisterForm({
  eventId,
  eventTitle,
  className,
}: {
  eventId: string;
  eventTitle: string;
  className?: string;
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    guests: 1,
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/event-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          eventTitle,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          guests: form.guests,
          notes: form.notes,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setStatus("done");
      setMessage("You're registered! We'll be in touch.");
      setForm({ fullName: "", email: "", phone: "", guests: 1, notes: "" });
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Registration failed");
    }
  };

  if (status === "done") {
    return (
      <div className={cn("text-center space-y-3", className)}>
        <p className="text-bmw-blue font-medium">{message}</p>
        <Button variant="secondary" size="sm" onClick={() => setStatus("idle")}>
          Register another guest
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={cn("space-y-3 text-left", className)}>
      <h3 className="font-bold text-center mb-1">Register for this event</h3>
      <input
        className={inputClass}
        required
        placeholder="Full name"
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
      />
      <input
        className={inputClass}
        required
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className={inputClass}
        required
        type="tel"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <input
        className={inputClass}
        type="number"
        min={1}
        max={10}
        placeholder="Guests (including you)"
        value={form.guests}
        onChange={(e) => setForm({ ...form, guests: Math.max(1, Number(e.target.value) || 1) })}
      />
      <textarea
        className={inputClass}
        rows={2}
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />
      {message && status === "error" && <p className="text-sm text-bmw-red">{message}</p>}
      <Button type="submit" className="w-full" variant="primary">
        {status === "loading" ? "Submitting..." : "Register Now"}
      </Button>
    </form>
  );
}
