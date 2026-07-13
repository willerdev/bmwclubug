"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Heart, MessageCircle } from "lucide-react";
import { youtubeEmbed } from "@/lib/blog-client";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  mediaUrls: string[];
  videoUrl: string;
  postType: string;
  authorName: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
};

type Comment = {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
};

function visitorKey() {
  if (typeof window === "undefined") return "";
  const key = "bmw_blog_visitor";
  let value = localStorage.getItem(key);
  if (!value) {
    value = `v_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
    localStorage.setItem(key, value);
  }
  return value;
}

export default function BlogPostPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const postRes = await fetch(`/api/blog/${id}`);
      if (!postRes.ok) {
        setPost(null);
        return;
      }
      const p = await postRes.json();
      setPost(p);
      setLikes(p.likesCount || 0);
      const [cRes, lRes] = await Promise.all([
        fetch(`/api/blog/${p.id}/comments`),
        fetch(`/api/blog/${p.id}/like?visitorKey=${encodeURIComponent(visitorKey())}`),
      ]);
      if (cRes.ok) setComments(await cRes.json());
      if (lRes.ok) {
        const likeData = await lRes.json();
        setLiked(Boolean(likeData.liked));
        setLikes(Number(likeData.likesCount ?? p.likesCount ?? 0));
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleLike = async () => {
    if (!post) return;
    const res = await fetch(`/api/blog/${post.id}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorKey: visitorKey() }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setLiked(Boolean(data.liked));
    setLikes(Number(data.likesCount ?? 0));
  };

  const submitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!post) return;
    setError("");
    const res = await fetch(`/api/blog/${post.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName: name, content: comment }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Failed to comment");
      return;
    }
    setComment("");
    setComments((prev) => [data, ...prev]);
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Blog" subtitle="Loading…" />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <PageHeader title="Post not found" subtitle="This blog post may have been removed." />
        <div className="text-center pb-20">
          <Link href="/blog" className="text-bmw-blue-light text-sm">← Back to blog</Link>
        </div>
      </>
    );
  }

  const embed = youtubeEmbed(post.videoUrl);
  const isDirectVideo = post.videoUrl.startsWith("/api/media") || /\.(mp4|webm|ogg)$/i.test(post.videoUrl);

  return (
    <>
      <PageHeader title={post.title} subtitle={`${post.authorName} · ${post.postType}`} />
      <section className="section-padding pt-0">
        <div className="container-custom max-w-3xl mx-auto space-y-6">
          {(post.coverUrl || post.mediaUrls[0]) && (
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden">
              <Image
                src={post.coverUrl || post.mediaUrls[0]}
                alt={post.title}
                fill
                className="object-cover"
                sizes="800px"
                priority
                unoptimized={(post.coverUrl || post.mediaUrls[0] || "").startsWith("/api/media")}
              />
            </div>
          )}

          <GlassCard>
            <div className="flex items-center justify-between gap-4 mb-4">
              <p className="text-xs text-white/40">
                {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
              </p>
              <button
                type="button"
                onClick={toggleLike}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  liked ? "border-bmw-red/50 text-bmw-red bg-bmw-red/10" : "border-white/15 text-white/70 hover:border-bmw-red/40"
                }`}
              >
                <Heart size={14} className={liked ? "fill-bmw-red" : ""} />
                {likes}
              </button>
            </div>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-white/80 leading-relaxed">
              {post.content}
            </div>
          </GlassCard>

          {post.mediaUrls?.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {post.mediaUrls.map((src, i) => (
                <div key={`${src}-${i}`} className="relative aspect-square rounded-xl overflow-hidden">
                  <Image src={src} alt="" fill className="object-cover" sizes="400px" unoptimized={src.startsWith("/api/media")} />
                </div>
              ))}
            </div>
          )}

          {post.videoUrl && (
            <GlassCard className="p-0 overflow-hidden">
              {isDirectVideo ? (
                <video src={post.videoUrl} controls className="w-full aspect-video bg-black" />
              ) : embed ? (
                <iframe
                  src={embed}
                  title={post.title}
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <a href={post.videoUrl} className="block p-4 text-bmw-blue-light text-sm" target="_blank" rel="noreferrer">
                  Open video
                </a>
              )}
            </GlassCard>
          )}

          <GlassCard>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MessageCircle size={18} className="text-bmw-blue" /> Comments ({comments.length})
            </h3>
            <form onSubmit={submitComment} className="space-y-3 mb-6">
              <input
                className="w-full px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <textarea
                className="w-full px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50 resize-none"
                rows={3}
                placeholder="Write a comment…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              {error && <p className="text-sm text-bmw-red">{error}</p>}
              <button type="submit" className="px-5 py-2.5 rounded-full text-sm glass-panel border border-bmw-blue/30 glow-blue">
                Post comment
              </button>
            </form>
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm">{c.authorName}</p>
                    <p className="text-[10px] text-white/35">
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                    </p>
                  </div>
                  <p className="text-sm text-white/65 mt-1 whitespace-pre-wrap">{c.content}</p>
                </div>
              ))}
              {comments.length === 0 && <p className="text-sm text-white/40">Be the first to comment.</p>}
            </div>
          </GlassCard>

          <div className="text-center">
            <Link href="/blog" className="text-sm text-bmw-blue-light">← Back to blog</Link>
          </div>
        </div>
      </section>
    </>
  );
}
