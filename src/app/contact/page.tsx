"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { CLUB_CONTACT } from "@/lib/constants";
import { useApiObject } from "@/hooks/useApiData";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { data: settings } = useApiObject<{
    contact?: { phone?: string; email?: string; location?: string };
  }>("/api/settings", {});
  const contact = {
    phone: settings.contact?.phone || CLUB_CONTACT.phone,
    email: settings.contact?.email || CLUB_CONTACT.email,
    location: settings.contact?.location || CLUB_CONTACT.location,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="Get in touch with BMW Club Uganda"
      />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            <GlassCard>
              <h3 className="font-bold text-lg mb-6">Send us a message</h3>
              {submitted ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="w-16 h-16 glass-panel rounded-full flex items-center justify-center mx-auto mb-4 glow-blue border border-bmw-blue/30">
                    <Send size={24} />
                  </div>
                  <p className="text-lg font-bold">Message Sent!</p>
                  <p className="text-white/50 mt-2">We&apos;ll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" placeholder="Your Name" required className="w-full px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50" />
                  <input type="email" placeholder="Email Address" required className="w-full px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50" />
                  <input type="text" placeholder="Subject" required className="w-full px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50" />
                  <textarea placeholder="Your Message" rows={5} required className="w-full px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50 resize-none" />
                  <Button className="w-full">Send Message</Button>
                </form>
              )}
            </GlassCard>

            <div className="space-y-6">
              <GlassCard>
                <h3 className="font-bold text-lg mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 glass rounded-xl flex items-center justify-center"><MapPin size={20} className="text-bmw-blue" /></div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-white/50">{contact.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 glass rounded-xl flex items-center justify-center"><Phone size={20} className="text-bmw-blue" /></div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-white/50">{contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 glass rounded-xl flex items-center justify-center"><Mail size={20} className="text-bmw-blue" /></div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-white/50">{contact.email}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-bold text-lg mb-3">Office Hours</h3>
                <div className="space-y-2 text-sm text-white/60">
                  <div className="flex justify-between"><span>Monday - Friday</span><span>9:00 AM - 6:00 PM</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span>10:00 AM - 4:00 PM</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span>Closed</span></div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
