"use client";

import { useApiList } from "@/hooks/useApiData";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  mediaUrls: string[];
  postType: string;
  authorName: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
};

export default function BlogPage() {
  const { data: posts, loading } = useApiList<Post>("/api/blog");

  return (
    <>
      <PageHeader
        title="Club Blog"
        subtitle="Daily updates, stories, photos, and videos from BMW Club Uganda"
      />
      <section className="section-padding pt-0">
        <div className="container-custom">
          {loading && <p className="text-center text-white/40">Loading posts…</p>}
          {!loading && posts.length === 0 && (
            <p className="text-center text-white/40">No blog posts yet. Check back soon.</p>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => {
              const cover = post.coverUrl || post.mediaUrls?.[0] || "/images/hero_image.jpeg";
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 9) * 0.05 }}
                >
                  <Link href={`/blog/${post.slug || post.id}`}>
                    <GlassCard className="p-0 overflow-hidden h-full group">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={cover}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          unoptimized={cover.startsWith("/api/media")}
                        />
                        <span className="absolute top-3 left-3 glass px-2 py-1 rounded-full text-[10px] uppercase tracking-wider">
                          {post.postType}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold group-hover:text-bmw-blue-light transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-white/50 mt-2 line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center justify-between mt-4 text-xs text-white/40">
                          <span>{post.authorName}</span>
                          <span className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1">
                              <Heart size={12} /> {post.likesCount}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MessageCircle size={12} /> {post.commentsCount}
                            </span>
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
