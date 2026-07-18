"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { MultiImagePicker } from "@/components/admin/MultiImagePicker";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";
import type { EventPost } from "@/types";

type EventItem = {
  id: string;
  title: string;
  poster: string;
  date: string;
  time: string;
  venue: string;
  district: string;
  description: string;
  status: "upcoming" | "past";
  maxCapacity: number;
  registeredCount: number;
  gallery?: string[];
  posts?: EventPost[];
};

const empty: Omit<EventItem, "id"> = {
  title: "",
  poster: "/images/event_1.jpeg",
  date: new Date().toISOString().slice(0, 10),
  time: "9:00 AM",
  venue: "",
  district: "Kampala",
  description: "",
  status: "upcoming",
  maxCapacity: 50,
  registeredCount: 0,
};

const emptyPost = {
  title: "",
  content: "",
  images: [] as string[],
};

export default function AdminEventsPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [form, setForm] = useState(empty);
  const [gallery, setGallery] = useState<string[]>([]);
  const [posts, setPosts] = useState<EventPost[]>([]);
  const [postForm, setPostForm] = useState(emptyPost);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    setItems(data);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const resetEditor = () => {
    setForm(empty);
    setGallery([]);
    setPosts([]);
    setPostForm(emptyPost);
    setEditingId(null);
    setEditingPostId(null);
  };

  const loadEventContent = async (id: string) => {
    const res = await fetch(`/api/events/${id}/content`);
    if (!res.ok) return { gallery: [], posts: [] as EventPost[] };
    return res.json();
  };

  const save = async () => {
    setMessage("");
    setError("");
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    const res = await fetch(editingId ? `/api/events/${editingId}` : "/api/events", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }

    const eventId = String(editingId || data.id);
    const contentRes = await fetch(`/api/events/${eventId}/content`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gallery, posts }),
    });
    if (!contentRes.ok) {
      const contentData = await contentRes.json().catch(() => ({}));
      setError(contentData.error || "Event saved, but gallery/posts failed");
      return;
    }

    resetEditor();
    setMessage("Saved");
    await load();
  };

  const savePost = async () => {
    if (!editingId) {
      setError("Save the event first, then add posts");
      return;
    }
    setError("");
    if (!postForm.title.trim() && !postForm.content.trim() && postForm.images.length === 0) {
      setError("Add a title, text, or image for the post");
      return;
    }

    const endpoint = editingPostId
      ? `/api/events/${editingId}/content/${editingPostId}`
      : `/api/events/${editingId}/content`;
    const res = await fetch(endpoint, {
      method: editingPostId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postForm),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Failed to save post");
      return;
    }
    setPosts(data.posts || []);
    setGallery(data.gallery || gallery);
    setPostForm(emptyPost);
    setEditingPostId(null);
    setMessage(editingPostId ? "Post updated" : "Post added");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (editingId === id) resetEditor();
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="text-white/50 mt-1">
          Create events, upload multiple gallery images, and add posts/images for a specific event.
        </p>
      </div>

      <GlassCard className="space-y-4">
        <h2 className="font-bold text-lg">{editingId ? "Edit event" : "New event"}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <AdminField label="Title">
            <input className={adminInput} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </AdminField>
          <AdminField label="Date">
            <input type="date" className={adminInput} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </AdminField>
          <AdminField label="Time">
            <input className={adminInput} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </AdminField>
          <AdminField label="Venue">
            <input className={adminInput} value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
          </AdminField>
          <AdminField label="District">
            <input className={adminInput} value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
          </AdminField>
          <AdminField label="Status">
            <select className={adminInput} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "upcoming" | "past" })}>
              <option value="upcoming" className="bg-carbon">Upcoming</option>
              <option value="past" className="bg-carbon">Past</option>
            </select>
          </AdminField>
          <AdminField label="Capacity">
            <input type="number" className={adminInput} value={form.maxCapacity} onChange={(e) => setForm({ ...form, maxCapacity: Number(e.target.value) })} />
          </AdminField>
          <AdminField label="Registered">
            <input type="number" className={adminInput} value={form.registeredCount} onChange={(e) => setForm({ ...form, registeredCount: Number(e.target.value) })} />
          </AdminField>
          <AdminField label="Description" className="md:col-span-2">
            <textarea className={adminInput} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </AdminField>
          <div className="md:col-span-2">
            <ImagePicker value={form.poster} onChange={(poster) => setForm({ ...form, poster })} label="Main event poster" />
          </div>
          <div className="md:col-span-2">
            <MultiImagePicker value={gallery} onChange={setGallery} label="Event gallery images" max={30} />
          </div>
        </div>
        <div className="flex gap-3">
          <AdminButton onClick={save}>{editingId ? "Update event" : "Create event"}</AdminButton>
          {editingId && (
            <AdminButton variant="secondary" onClick={resetEditor}>
              Cancel
            </AdminButton>
          )}
        </div>
        {error && <p className="text-sm text-bmw-red">{error}</p>}
        {message && <p className="text-sm text-bmw-blue-light">{message}</p>}
      </GlassCard>

      {editingId && (
        <GlassCard className="space-y-4">
          <div>
            <h2 className="font-bold text-lg">{editingPostId ? "Edit event post" : "Add post / images to this event"}</h2>
            <p className="text-sm text-white/50 mt-1">
              Use this to publish updates or additional photos for the selected event.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <AdminField label="Post title" className="md:col-span-2">
              <input
                className={adminInput}
                value={postForm.title}
                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                placeholder="Meetup recap, photo dump, announcement..."
              />
            </AdminField>
            <AdminField label="Post content" className="md:col-span-2">
              <textarea
                className={adminInput}
                rows={4}
                value={postForm.content}
                onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                placeholder="Write an update for this event"
              />
            </AdminField>
            <div className="md:col-span-2">
              <MultiImagePicker
                value={postForm.images}
                onChange={(images) => setPostForm({ ...postForm, images })}
                label="Post images"
                max={30}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <AdminButton onClick={savePost}>{editingPostId ? "Update post" : "Add post"}</AdminButton>
            {editingPostId && (
              <AdminButton
                variant="secondary"
                onClick={() => {
                  setEditingPostId(null);
                  setPostForm(emptyPost);
                }}
              >
                Cancel post edit
              </AdminButton>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-semibold">Existing posts ({posts.length})</h3>
            {posts.length === 0 && <p className="text-sm text-white/45">No posts yet for this event.</p>}
            {posts.map((post) => (
              <div key={post.id} className="glass-frosted rounded-xl p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{post.title || "Untitled post"}</p>
                    <p className="text-xs text-white/40">{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <AdminButton
                      variant="secondary"
                      onClick={() => {
                        setEditingPostId(post.id);
                        setPostForm({
                          title: post.title,
                          content: post.content,
                          images: post.images || [],
                        });
                      }}
                    >
                      Edit
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      onClick={async () => {
                        const res = await fetch(`/api/events/${editingId}/content/${post.id}`, {
                          method: "DELETE",
                        });
                        const data = await res.json().catch(() => ({}));
                        if (res.ok) setPosts(data.posts || []);
                      }}
                    >
                      Delete
                    </AdminButton>
                  </div>
                </div>
                {post.content && <p className="text-sm text-white/65 whitespace-pre-wrap">{post.content}</p>}
                {post.images?.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {post.images.map((src, i) => (
                      <div key={`${src}-${i}`} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image src={src} alt="" fill className="object-cover" sizes="100px" unoptimized={src.startsWith("/api/media")} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item) => (
          <GlassCard key={item.id} className="p-0 overflow-hidden">
            <div className="relative h-36">
              <Image src={item.poster || "/images/event_1.jpeg"} alt="" fill className="object-cover" sizes="400px" unoptimized={item.poster?.startsWith("/api/media")} />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-xs text-white/50">{item.date} · {item.district} · {item.status}</p>
              <div className="flex gap-2 pt-2">
                <AdminButton
                  variant="secondary"
                  onClick={async () => {
                    setEditingId(item.id);
                    setForm({ ...item });
                    const content = await loadEventContent(item.id);
                    setGallery(content.gallery || []);
                    setPosts(content.posts || []);
                    setPostForm(emptyPost);
                    setEditingPostId(null);
                    setMessage("");
                    setError("");
                  }}
                >
                  Edit
                </AdminButton>
                <AdminButton variant="danger" onClick={() => remove(item.id)}>Delete</AdminButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
