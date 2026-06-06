import { useEffect, useState } from "react";
import api, { fileUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Heart, MessageSquare, Upload, Send } from "lucide-react";
import { timeIST, dateIST } from "@/lib/time";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Wall() {
  const { user }  = useAuth();
  const [posts,   setPosts]   = useState([]);
  const [content, setContent] = useState("");
  const [photoId, setPhotoId] = useState("");
  const [busy,    setBusy]    = useState(false);

  const load = async () => {
    const { data } = await api.get("/wall/posts");
    setPosts(data);
  };
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    try {
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setPhotoId(data.id); toast.success("Image attached");
    } catch { toast.error("Upload failed"); }
  };

  const post = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setBusy(true);
    try {
      await api.post("/wall/posts", { content, image_url: photoId });
      setContent(""); setPhotoId("");
      load(); toast.success("Posted");
    } catch { toast.error("Failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="grain max-w-3xl mx-auto px-6 lg:px-8 py-12">
      <div className="text-xs tracking-[0.3em] uppercase text-[#E27D60] mb-3">Student Wall</div>
      <h1 className="editorial-heading text-5xl mb-8">A diary of campus.</h1>

      {user ? (
        <form onSubmit={post} data-testid="wall-form" className="border border-[#27272A] bg-[#141417] p-5 mb-8">
          <textarea
            data-testid="wall-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="What's on your mind, scholar?"
            className="w-full bg-transparent outline-none resize-none border-b border-[#27272A] pb-3 focus:border-[#E27D60]"
          />
          <div className="flex items-center justify-between mt-3">
            <label className="inline-flex items-center gap-2 text-xs text-[#A1A1AA] hover:text-white cursor-pointer">
              <Upload className="w-4 h-4" /> {photoId ? "Image attached ✓" : "Attach image"}
              <input data-testid="wall-upload" type="file" accept="image/*" className="hidden" onChange={upload} />
            </label>
            <button data-testid="wall-submit" disabled={busy} className="btn-primary text-sm">{busy ? "…" : "Post"}</button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-5 border border-[#27272A] bg-[#141417] text-sm text-[#A1A1AA]">
          <Link to="/login" className="text-[#E27D60] hover:underline">Sign in</Link> to post on the wall.
        </div>
      )}

      <div className="space-y-5">
        {posts.length === 0
          ? <div className="text-[#A1A1AA] py-8 text-center">The wall is empty. Write the first chapter.</div>
          : posts.map((p) => <PostCard key={p.id} post={p} onChange={load} />)
        }
      </div>
    </div>
  );
}

function PostCard({ post, onChange }) {
  const { user }  = useAuth();
  const [liked,        setLiked]        = useState(false);
  const [likes,        setLikes]        = useState(post.likes_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments,     setComments]     = useState([]);
  const [newComment,   setNewComment]   = useState("");

  useEffect(() => {
    if (!user) return;
    api.get(`/wall/posts/${post.id}/likes/me`).then(({ data }) => setLiked(data.liked)).catch(() => {});
  }, [post.id, user]);

  const toggleLike = async () => {
    if (!user) return toast.error("Sign in to like");
    const { data } = await api.post(`/wall/posts/${post.id}/like`);
    setLiked(data.liked);
    setLikes((l) => l + (data.liked ? 1 : -1));
  };

  const loadComments = async () => {
    const { data } = await api.get(`/wall/posts/${post.id}/comments`);
    setComments(data); setShowComments(true);
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await api.post("/wall/comments", { post_id: post.id, content: newComment });
    setNewComment(""); loadComments(); onChange?.();
  };

  return (
    <article className="card-edge p-5" data-testid={`wall-post-${post.id}`}>
      <header className="flex items-baseline justify-between mb-3">
        <div>
          <div className="font-serif text-xl">{post.author_name}</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1AA]">
            {post.author_college} · {dateIST(post.created_at)} · {timeIST(post.created_at)} IST
          </div>
        </div>
      </header>
      <p className="text-[#e4e4e7] leading-relaxed whitespace-pre-wrap">{post.content}</p>
      {post.image_url && (
        <div className="mt-4 border border-[#27272A]">
          <img src={fileUrl(post.image_url)} alt="" className="w-full max-h-96 object-cover" />
        </div>
      )}
      <footer className="mt-4 flex items-center gap-5 text-sm">
        <button data-testid={`like-${post.id}`} onClick={toggleLike}
          className={`inline-flex items-center gap-2 transition ${liked ? "text-[#E27D60]" : "text-[#A1A1AA] hover:text-[#E27D60]"}`}>
          <Heart className={`w-4 h-4 ${liked ? "fill-[#E27D60]" : ""}`} /> {likes}
        </button>
        <button data-testid={`comment-toggle-${post.id}`}
          onClick={() => showComments ? setShowComments(false) : loadComments()}
          className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-white transition">
          <MessageSquare className="w-4 h-4" /> {post.comments_count || comments.length}
        </button>
      </footer>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-[#27272A] space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="text-sm">
              <span className="font-serif text-[#E27D60]">{c.author_name}</span>
              <span className="text-[#A1A1AA] text-xs ml-2">{timeIST(c.created_at)} IST</span>
              <div className="text-[#d4d4d8] mt-0.5">{c.content}</div>
            </div>
          ))}
          {user && (
            <form onSubmit={addComment} className="flex gap-2 mt-3">
              <input
                data-testid={`comment-input-${post.id}`}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment…"
                className="flex-1 bg-[#0A0A0B] border border-[#27272A] px-3 py-2 text-sm outline-none focus:border-[#E27D60]"
              />
              <button data-testid={`comment-submit-${post.id}`} className="btn-primary text-sm px-3">
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  );
}
