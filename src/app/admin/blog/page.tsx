"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";
import { MAX_BLOG_IMAGES } from "@/lib/media-limits";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  mediaUrls: string[];
  videoUrl: string;
  postType: "update" | "story" | "photo" | "video";
  isPublished: boolean;
  likesCount: number;
  commentsCount: number;
  authorName: string;
  createdAt: string;
};

const empty = {
  title: "",
  excerpt: "",
  content: "",
  coverUrl: "",
  mediaUrls: [] as string[],
  videoUrl: "",
  postType: "update" as Post["postType"],
  isPublished: true,
};

export default function AdminBlogPage() {
  const [items, setItems] = useState<Post[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftImage, setDraftImage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/blog?all=1");
    if (res.ok) setItems(await res.json());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const addImage = () => {
    if (!draftImage.trim()) return;
    if (form.mediaUrls.length >= MAX_BLOG_IMAGES) {
      setError(`Maximum ${MAX_BLOG_IMAGES} pictures per post`);
      return;
    }
    setForm({
      ...form,
      mediaUrls: [...form.mediaUrls, draftImage],
      coverUrl: form.coverUrl || draftImage,
    });
    setDraftImage("");
    setError("");
  };

  const save = async () => {
    setError("");
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    const res = await fetch(editingId ? `/api/blog/${editingId}` : "/api/blog", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Failed to save post");
      return;
    }
    setForm(empty);
    setEditingId(null);
    setDraftImage("");
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="text-white/50 mt-1 text-sm">
          Share daily updates, stories, photos, and videos. Visitors can like and comment on the public blog.
        </p>
      </div>

      <GlassCard className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <AdminField label="Title">
            <input className={adminInput} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </AdminField>
          <AdminField label="Post type">
            <select
              className={adminInput}
              value={form.postType}
              onChange={(e) => setForm({ ...form, postType: e.target.value as Post["postType"] })}
            >
              <option value="update" className="bg-carbon">Daily update</option>
              <option value="story" className="bg-carbon">Story</option>
              <option value="photo" className="bg-carbon">Photo post</option>
              <option value="video" className="bg-carbon">Video post</option>
            </select>
          </AdminField>
          <AdminField label="Excerpt" className="md:col-span-2">
            <input className={adminInput} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short summary" />
          </AdminField>
          <AdminField label="Story / update text" className="md:col-span-2">
            <textarea className={adminInput} rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </AdminField>
          <AdminField label="Video URL (YouTube or uploaded)" className="md:col-span-2">
            <input
              className={adminInput}
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=... or /api/media/..."
            />
          </AdminField>
          <label className="flex items-center gap-2 text-sm text-white/70 md:col-span-2">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            />
            Published on /blog
          </label>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-white/70">Photos ({form.mediaUrls.length}/{MAX_BLOG_IMAGES})</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {form.mediaUrls.map((src, i) => (
              <div key={`${src}-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                <Image src={src} alt="" fill className="object-cover" sizes="140px" unoptimized={src.startsWith("/api/media")} />
                <button
                  type="button"
                  className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-black/70"
                  onClick={() =>
                    setForm({
                      ...form,
                      mediaUrls: form.mediaUrls.filter((_, idx) => idx !== i),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          {form.mediaUrls.length < MAX_BLOG_IMAGES && (
            <div className="space-y-2">
              <ImagePicker value={draftImage} onChange={setDraftImage} label="Add photo" />
              <AdminButton variant="secondary" onClick={addImage} disabled={!draftImage}>
                Add photo to post
              </AdminButton>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-bmw-red">{error}</p>}
        <div className="flex gap-2">
          <AdminButton onClick={save}>{editingId ? "Update post" : "Publish post"}</AdminButton>
          {editingId && (
            <AdminButton
              variant="secondary"
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
            >
              Cancel
            </AdminButton>
          )}
        </div>
      </GlassCard>

      <div className="space-y-3">
        {items.map((post) => (
          <GlassCard key={post.id} className="flex flex-col sm:flex-row gap-4">
            {post.coverUrl || post.mediaUrls[0] ? (
              <div className="relative w-full sm:w-40 h-28 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={post.coverUrl || post.mediaUrls[0]}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="160px"
                  unoptimized={(post.coverUrl || post.mediaUrls[0] || "").startsWith("/api/media")}
                />
              </div>
            ) : null}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-bmw-blue">{post.postType}</p>
              <h3 className="font-bold truncate">{post.title}</h3>
              <p className="text-sm text-white/50 line-clamp-2 mt-1">{post.excerpt || post.content}</p>
              <p className="text-xs text-white/35 mt-2">
                {post.likesCount} likes · {post.commentsCount} comments · {post.isPublished ? "Published" : "Draft"}
              </p>
              <div className="flex gap-2 mt-3">
                <AdminButton
                  variant="secondary"
                  onClick={() => {
                    setEditingId(post.id);
                    setForm({
                      title: post.title,
                      excerpt: post.excerpt,
                      content: post.content,
                      coverUrl: post.coverUrl,
                      mediaUrls: post.mediaUrls || [],
                      videoUrl: post.videoUrl,
                      postType: post.postType,
                      isPublished: post.isPublished,
                    });
                  }}
                >
                  Edit
                </AdminButton>
                <AdminButton
                  variant="danger"
                  onClick={async () => {
                    await fetch(`/api/blog/${post.id}`, { method: "DELETE" });
                    await load();
                  }}
                >
                  Delete
                </AdminButton>
              </div>
            </div>
          </GlassCard>
        ))}
        {items.length === 0 && <p className="text-white/40 text-sm text-center py-8">No blog posts yet.</p>}
      </div>
    </div>
  );
}
