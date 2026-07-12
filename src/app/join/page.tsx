"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { MEMBERSHIP_LEVELS } from "@/lib/constants";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

const BENEFITS = [
  "Access to exclusive events and road trips",
  "Member directory and networking",
  "Marketplace buying and selling privileges",
  "Partner garage discounts",
  "Forum and community access",
  "Digital membership card with QR pass",
  "Achievement badges and recognition",
  "Priority event registration",
];

export default function JoinPage() {
  const [step, setStep] = useState(1);

  return (
    <>
      <PageHeader
        title="Join BMW Club Uganda"
        subtitle="Become part of Uganda's premier BMW enthusiast community"
      />

      <section className="section-padding pt-0">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="flex justify-center gap-2 mb-12">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s ? "glass-panel border-bmw-blue/40 glow-blue text-white" : "glass-frosted text-white/40 border-white/10"
                }`}
              >
                {s}
              </div>
            ))}
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard>
                <h3 className="font-bold text-xl mb-6">Membership Benefits</h3>
                <ul className="space-y-3 mb-8">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-bmw-blue shrink-0 mt-0.5" />
                      <span className="text-white/80">{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="grid sm:grid-cols-3 gap-3 mb-8">
                  {MEMBERSHIP_LEVELS.slice(0, 3).map((level) => (
                    <div key={level} className="glass p-4 rounded-xl text-center">
                      <p className="font-bold text-sm">{level}</p>
                      <p className="text-bmw-blue text-lg font-bold mt-1">
                        {level === "Explorer" ? "Free" : level === "Enthusiast" ? "UGX 150K" : "UGX 350K"}
                      </p>
                      <p className="text-[10px] text-white/40 mt-1">per year</p>
                    </div>
                  ))}
                </div>
                <Button onClick={() => setStep(2)} className="w-full">Continue Application</Button>
              </GlassCard>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard>
                <h3 className="font-bold text-xl mb-6">Personal Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input placeholder="First Name" className="px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50" />
                  <input placeholder="Last Name" className="px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50" />
                  <input placeholder="Email" type="email" className="px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50" />
                  <input placeholder="Phone (+256)" className="px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50" />
                  <input placeholder="District" className="px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50 sm:col-span-2" />
                  <input placeholder="BMW Model(s) Owned" className="px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50 sm:col-span-2" />
                  <textarea placeholder="Tell us about your passion for BMW..." rows={3} className="px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50 sm:col-span-2 resize-none" />
                </div>
                <div className="flex gap-4 mt-6">
                  <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
                  <Button onClick={() => setStep(3)} className="flex-1">Continue</Button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard className="text-center">
                <div className="w-20 h-20 glass-panel rounded-full flex items-center justify-center mx-auto mb-6 glow-blue border border-bmw-blue/30">
                  <CheckCircle size={40} />
                </div>
                <h3 className="font-bold text-2xl mb-3">Application Submitted!</h3>
                <p className="text-white/60 max-w-md mx-auto">
                  Welcome to BMW Club Uganda! Your application is being reviewed.
                  You&apos;ll receive a confirmation email within 48 hours.
                </p>
                <Button href="/dashboard" className="mt-8">Go to Dashboard</Button>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
