"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MAX_JOIN_VEHICLE_PHOTOS } from "@/lib/media-limits";
import { motion } from "framer-motion";
import { CheckCircle, Upload } from "lucide-react";
import { useState } from "react";

const STEPS = [
  { id: 1, label: "Personal" },
  { id: 2, label: "Vehicle" },
  { id: 3, label: "Pledge" },
] as const;

const MODIFICATIONS = ["None", "Performance", "Cosmetic", "Audio", "Other"] as const;

const HEAR_ABOUT = [
  "Member Referral",
  "Social Media",
  "Event / Meetup",
  "Online",
  "Other",
] as const;

const INTERESTS = [
  "Social Drives",
  "Networking",
  "Track Days",
  "Charity & CSR",
  "Technical Knowledge",
  "Lifestyle & Travel",
] as const;

const inputClass =
  "w-full px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50";

const labelClass = "block text-sm text-white/70 mb-2";

type FormState = {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  occupation: string;
  organisation: string;
  position: string;
  ownerPhoto: File | null;
  bmwModel: string;
  yearOfManufacture: string;
  engine: string;
  plateNumber: string;
  vehiclePhotos: File[];
  modifications: string[];
  modificationOther: string;
  hearAbout: string;
  hearAboutOther: string;
  interests: string[];
  pledge: boolean;
  signature: string;
  joinDate: string;
};

const initialForm: FormState = {
  email: "",
  fullName: "",
  phone: "",
  address: "",
  occupation: "",
  organisation: "",
  position: "",
  ownerPhoto: null,
  bmwModel: "",
  yearOfManufacture: "",
  engine: "",
  plateNumber: "",
  vehiclePhotos: [],
  modifications: [],
  modificationOther: "",
  hearAbout: "",
  hearAboutOther: "",
  interests: [],
  pledge: false,
  signature: "",
  joinDate: new Date().toISOString().split("T")[0],
};

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelClass}>
        {label}
        {required && <span className="text-bmw-red ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function FileUpload({
  label,
  required,
  accept,
  multiple,
  files,
  onChange,
  hint,
  maxFiles = 1,
}: {
  label: string;
  required?: boolean;
  accept: string;
  multiple?: boolean;
  files: File[];
  onChange: (files: File[]) => void;
  hint: string;
  maxFiles?: number;
}) {
  return (
    <Field label={label} required={required}>
      <label className="flex flex-col items-center justify-center gap-3 glass-frosted rounded-xl border border-dashed border-white/20 hover:border-bmw-blue/40 px-4 py-8 cursor-pointer transition-colors">
        <Upload size={22} className="text-bmw-blue-light" />
        <span className="text-sm text-white/70 text-center">{hint}</span>
        {files.length > 0 && (
          <span className="text-xs text-bmw-blue-light">
            {files.map((f) => f.name).join(", ")}
          </span>
        )}
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            const selected = Array.from(e.target.files ?? []);
            onChange(multiple ? selected.slice(0, maxFiles) : selected.slice(0, 1));
          }}
        />
      </label>
    </Field>
  );
}

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState("");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const toggleArrayValue = (key: "modifications" | "interests", value: string) => {
    setForm((prev) => {
      const current = prev[key];
      if (key === "modifications" && value === "None") {
        return { ...prev, modifications: current.includes("None") ? [] : ["None"] };
      }
      const withoutNone = current.filter((v) => v !== "None");
      const next = withoutNone.includes(value)
        ? withoutNone.filter((v) => v !== value)
        : [...withoutNone, value];
      return { ...prev, [key]: next };
    });
    setError("");
  };

  const validateStep = (current: number) => {
    if (current === 1) {
      if (!form.email || !form.fullName || !form.phone || !form.address || !form.occupation) {
        return "Please complete all required personal details.";
      }
      if (!form.ownerPhoto) return "Please upload a clear owner photograph.";
    }
    if (current === 2) {
      if (!form.bmwModel || !form.yearOfManufacture || !form.engine || !form.plateNumber) {
        return "Please complete all required vehicle details.";
      }
      if (form.vehiclePhotos.length === 0) {
        return "Please upload at least one clear photo of your BMW.";
      }
      if (form.modifications.length === 0) {
        return "Please select any modifications (or None).";
      }
      if (form.modifications.includes("Other") && !form.modificationOther.trim()) {
        return "Please describe your other modifications.";
      }
    }
    if (current === 3) {
      if (!form.hearAbout) return "Please tell us how you heard about the club.";
      if (form.hearAbout === "Other" && !form.hearAboutOther.trim()) {
        return "Please specify how you heard about the club.";
      }
      if (!form.pledge) return "Please agree to the membership pledge.";
      if (!form.signature.trim()) return "Please type your name as a signature.";
      if (!form.joinDate) return "Please enter the date of joining.";
    }
    return "";
  };

  const goNext = () => {
    const message = validateStep(step);
    if (message) {
      setError(message);
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  };

  const handleSubmit = async () => {
    const message = validateStep(3);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    try {
      const payload = {
        email: form.email,
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        occupation: form.occupation,
        organisation: form.organisation,
        position: form.position,
        ownerPhotoName: form.ownerPhoto?.name ?? null,
        bmwModel: form.bmwModel,
        yearOfManufacture: form.yearOfManufacture,
        engine: form.engine,
        plateNumber: form.plateNumber,
        vehiclePhotoNames: form.vehiclePhotos.map((f) => f.name),
        modifications: form.modifications,
        modificationOther: form.modificationOther,
        hearAbout: form.hearAbout,
        hearAboutOther: form.hearAboutOther,
        interests: form.interests,
        pledge: form.pledge,
        signature: form.signature,
        joinDate: form.joinDate,
      };
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit application");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application");
    }
  };

  return (
    <>
      <PageHeader
        title="Official Member Registration"
        subtitle="BMW Club UG — fill in your details accurately to join the club"
      />

      <section className="section-padding pt-0">
        <div className="container-custom max-w-3xl mx-auto">
          {!submitted && (
            <>
              <p className="text-center text-white/55 text-sm mb-8 max-w-2xl mx-auto">
                Your details help us foster excellence, brotherhood, and a passion for driving.
                Fields marked <span className="text-bmw-red">*</span> are required.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10">
                {STEPS.map((s) => (
                  <div
                    key={s.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-full text-sm transition-all",
                      step >= s.id
                        ? "glass-panel border border-bmw-blue/40 text-white"
                        : "glass-frosted text-white/40 border border-white/10"
                    )}
                  >
                    <span
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                        step >= s.id ? "bmw-gradient" : "bg-white/10"
                      )}
                    >
                      {s.id}
                    </span>
                    {s.label}
                  </div>
                ))}
              </div>
            </>
          )}

          {submitted ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard className="text-center">
                <div className="w-20 h-20 glass-panel rounded-full flex items-center justify-center mx-auto mb-6 glow-blue border border-bmw-blue/30">
                  <CheckCircle size={40} />
                </div>
                <h3 className="font-bold text-2xl mb-3">Application Submitted!</h3>
                <p className="text-white/60 max-w-md mx-auto">
                  Thank you, {form.fullName || "member"}. Your BMW Club Uganda membership
                  application is being reviewed. We&apos;ll contact you at {form.email} within 48 hours.
                </p>
                <Button href="/dashboard" className="mt-8">
                  Go to Dashboard
                </Button>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard>
                {step === 1 && (
                  <>
                    <h3 className="font-bold text-xl mb-2">Step 1 — Personal Information</h3>
                    <p className="text-sm text-white/50 mb-6">
                      Details as per National ID / Passport
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Email" required className="sm:col-span-2">
                        <input
                          type="email"
                          className={inputClass}
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="you@email.com"
                        />
                      </Field>
                      <Field label="Full Name (as per National ID / Passport)" required className="sm:col-span-2">
                        <input
                          className={inputClass}
                          value={form.fullName}
                          onChange={(e) => update("fullName", e.target.value)}
                          placeholder="Full legal name"
                        />
                      </Field>
                      <Field label="Primary Contact Number" required>
                        <input
                          className={inputClass}
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          placeholder="+256 7XX XXX XXX"
                        />
                      </Field>
                      <Field label="Occupation / Profession" required>
                        <input
                          className={inputClass}
                          value={form.occupation}
                          onChange={(e) => update("occupation", e.target.value)}
                          placeholder="e.g. Engineer, Entrepreneur"
                        />
                      </Field>
                      <Field label="Residential Address (City / Area / Country)" required className="sm:col-span-2">
                        <input
                          className={inputClass}
                          value={form.address}
                          onChange={(e) => update("address", e.target.value)}
                          placeholder="Kampala / Nakasero / Uganda"
                        />
                      </Field>
                      <Field label="Organisation / Business Name">
                        <input
                          className={inputClass}
                          value={form.organisation}
                          onChange={(e) => update("organisation", e.target.value)}
                          placeholder="Optional"
                        />
                      </Field>
                      <Field label="Position / Role">
                        <input
                          className={inputClass}
                          value={form.position}
                          onChange={(e) => update("position", e.target.value)}
                          placeholder="Optional"
                        />
                      </Field>
                      <div className="sm:col-span-2">
                        <FileUpload
                          label="Clear Owner Photograph"
                          required
                          accept="image/*"
                          files={form.ownerPhoto ? [form.ownerPhoto] : []}
                          onChange={(files) => update("ownerPhoto", files[0] ?? null)}
                          hint="Upload 1 image. Max 10 MB."
                        />
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 className="font-bold text-xl mb-2">Step 2 — Vehicle Details</h3>
                    <p className="text-sm text-white/50 mb-6">
                      Tell us about the BMW you drive
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="BMW Model (e.g. 320i, M4, X5, 740Li)" required>
                        <input
                          className={inputClass}
                          value={form.bmwModel}
                          onChange={(e) => update("bmwModel", e.target.value)}
                          placeholder="e.g. M4 Competition"
                        />
                      </Field>
                      <Field label="Year of Manufacture" required>
                        <input
                          className={inputClass}
                          value={form.yearOfManufacture}
                          onChange={(e) => update("yearOfManufacture", e.target.value)}
                          placeholder="e.g. 2019"
                        />
                      </Field>
                      <Field label="Engine Type & Capacity" required>
                        <input
                          className={inputClass}
                          value={form.engine}
                          onChange={(e) => update("engine", e.target.value)}
                          placeholder="e.g. 2.0L Turbo, V8, Electric"
                        />
                      </Field>
                      <Field label="Registration Number / Plate" required>
                        <input
                          className={inputClass}
                          value={form.plateNumber}
                          onChange={(e) => update("plateNumber", e.target.value)}
                          placeholder="e.g. UAX 123A"
                        />
                      </Field>
                      <div className="sm:col-span-2">
                        <FileUpload
                          label="Clear Photo of your BMW Vehicle (Front / Side)"
                          required
                          accept="image/*"
                          multiple
                          maxFiles={MAX_JOIN_VEHICLE_PHOTOS}
                          files={form.vehiclePhotos}
                          onChange={(files) => update("vehiclePhotos", files)}
                          hint={`Upload up to ${MAX_JOIN_VEHICLE_PHOTOS} images. Max 10 MB per file.`}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Field label="Modifications (if any)" required>
                          <div className="flex flex-wrap gap-2">
                            {MODIFICATIONS.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => toggleArrayValue("modifications", option)}
                                className={cn(
                                  "px-4 py-2 rounded-full text-sm border transition-all",
                                  form.modifications.includes(option)
                                    ? "glass-panel border-bmw-blue/40 text-white"
                                    : "glass-frosted border-white/10 text-white/60 hover:border-white/25"
                                )}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </Field>
                        {form.modifications.includes("Other") && (
                          <input
                            className={cn(inputClass, "mt-3")}
                            value={form.modificationOther}
                            onChange={(e) => update("modificationOther", e.target.value)}
                            placeholder="Describe other modifications"
                          />
                        )}
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h3 className="font-bold text-xl mb-2">Step 3 — Interests & Membership Pledge</h3>
                    <p className="text-sm text-white/50 mb-6">
                      Almost done — confirm your interests and pledge
                    </p>

                    <div className="space-y-6">
                      <Field label="How did you hear about the BMW Club?" required>
                        <div className="flex flex-wrap gap-2">
                          {HEAR_ABOUT.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => update("hearAbout", option)}
                              className={cn(
                                "px-4 py-2 rounded-full text-sm border transition-all",
                                form.hearAbout === option
                                  ? "glass-panel border-bmw-blue/40 text-white"
                                  : "glass-frosted border-white/10 text-white/60 hover:border-white/25"
                              )}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        {form.hearAbout === "Other" && (
                          <input
                            className={cn(inputClass, "mt-3")}
                            value={form.hearAboutOther}
                            onChange={(e) => update("hearAboutOther", e.target.value)}
                            placeholder="Please specify"
                          />
                        )}
                      </Field>

                      <Field label="Primary Interest in the Club (tick all that apply)">
                        <div className="flex flex-wrap gap-2">
                          {INTERESTS.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggleArrayValue("interests", option)}
                              className={cn(
                                "px-4 py-2 rounded-full text-sm border transition-all",
                                form.interests.includes(option)
                                  ? "glass-panel border-bmw-red/40 text-white"
                                  : "glass-frosted border-white/10 text-white/60 hover:border-white/25"
                              )}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </Field>

                      <div className="glass-frosted rounded-2xl p-5 border border-white/10">
                        <h4 className="font-semibold mb-3">Membership Pledge</h4>
                        <p className="text-sm text-white/60 leading-relaxed mb-4">
                          I, the undersigned, hereby apply for membership to the BMW Club.
                          I commit to upholding the values, code of conduct, and reputation of the Club.
                          I agree to respect fellow members, promote responsible driving, and represent
                          the BMW brand with integrity and excellence at all times.
                        </p>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.pledge}
                            onChange={(e) => update("pledge", e.target.checked)}
                            className="mt-1 accent-[#1C69D4] w-4 h-4"
                          />
                          <span className="text-sm text-white/80">
                            Yes, I agree <span className="text-bmw-red">*</span>
                          </span>
                        </label>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Signature (type your name)" required>
                          <input
                            className={inputClass}
                            value={form.signature}
                            onChange={(e) => update("signature", e.target.value)}
                            placeholder="Type your full name"
                          />
                        </Field>
                        <Field label="Date of Joining" required>
                          <input
                            type="date"
                            className={inputClass}
                            value={form.joinDate}
                            onChange={(e) => update("joinDate", e.target.value)}
                          />
                        </Field>
                      </div>
                    </div>
                  </>
                )}

                {error && (
                  <p className="mt-5 text-sm text-bmw-red bg-bmw-red/10 border border-bmw-red/20 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <div className="flex gap-4 mt-8">
                  {step > 1 && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setError("");
                        setStep((s) => s - 1);
                      }}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button onClick={goNext} className="flex-1">
                      Continue
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} className="flex-1">
                      Submit Application
                    </Button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
