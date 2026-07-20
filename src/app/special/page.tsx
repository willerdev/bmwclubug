"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useApiList } from "@/hooks/useApiData";
import { motion } from "framer-motion";
import Image from "next/image";

type SpecialItem = {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt: string;
};

export default function SpecialPage() {
  const { data: items } = useApiList<SpecialItem>("/api/special");

  return (
    <>
      <PageHeader
        title="Special"
        subtitle={`${items.length} featured photo${items.length === 1 ? "" : "s"} and video${items.length === 1 ? "" : "s"} from the club`}
      />

      <section className="section-padding pt-0">
        <div className="container-custom">
          {items.length === 0 ? (
            <p className="text-center text-white/50">No special features yet. Check back soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {items.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 4) * 0.06 }}
                  className="space-y-3"
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                    {item.mediaType === "video" ? (
                      <video
                        src={item.mediaUrl}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Image
                        src={item.mediaUrl}
                        alt={item.title || "Special feature"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized={item.mediaUrl.startsWith("/api/media")}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-bmw-blue-light">
                      {item.mediaType}
                    </p>
                    <h2 className="text-xl font-bold mt-1">{item.title || "Featured moment"}</h2>
                    {item.description && (
                      <p className="text-sm text-white/60 mt-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
