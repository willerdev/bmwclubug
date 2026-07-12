"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { forumPosts } from "@/data/mock";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

const CATEGORIES = [
  "All", "Mechanical Advice", "Buying Tips", "BMW Projects", "Events",
  "Road Trips", "Photography", "Marketplace", "General Discussion",
];

export default function ForumPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [likes, setLikes] = useState<Record<string, number>>({});

  const filtered = useMemo(() => {
    return forumPosts.filter((post) => {
      const matchSearch = !search || post.title.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || post.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  const handleLike = (id: string, baseLikes: number) => {
    setLikes((prev) => ({
      ...prev,
      [id]: prev[id] !== undefined ? prev[id] : baseLikes + 1,
    }));
  };

  return (
    <>
      <PageHeader
        title="Community Forum"
        subtitle="Discuss, share advice, and connect with fellow BMW enthusiasts"
      />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <GlassCard className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3 glass-panel rounded-full font-medium glow-blue border border-bmw-blue/30">
                <Plus size={18} /> New Post
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    category === cat ? "glass-panel border-bmw-blue/30 text-white" : "glass-frosted hover:glass-strong border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </GlassCard>

          <div className="space-y-4">
            {filtered.slice(0, 30).map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 10) * 0.03 }}
              >
                <GlassCard className="group cursor-pointer hover:glass-strong">
                  <div className="flex gap-4">
                    {post.image && (
                      <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden hidden sm:block">
                        <Image src={post.image} alt="" fill className="object-cover" sizes="96px" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] text-bmw-blue uppercase tracking-wider">{post.category}</span>
                          <h3 className="font-bold mt-1 group-hover:text-bmw-blue transition-colors">{post.title}</h3>
                          <p className="text-sm text-white/50 mt-1 line-clamp-2">{post.content}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
                        <span>{post.author}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <button
                          onClick={() => handleLike(post.id, post.likes)}
                          className="flex items-center gap-1 hover:text-red-400 transition-colors ml-auto"
                        >
                          <Heart size={14} /> {likes[post.id] ?? post.likes}
                        </button>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={14} /> {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
