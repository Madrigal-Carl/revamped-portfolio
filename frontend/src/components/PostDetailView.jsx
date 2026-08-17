import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  X,
  MoreHorizontal,
  ExternalLink,
  LinkIcon,
  Heart,
  MessageCircle,
  Share2,
  Send,
  Check,
} from "lucide-react";
import { formatMonthYear } from "../hooks/useProjects";
import avatarImg from "../assets/me.jpg";

const domainOf = (url) => {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export default function PostDetailView({
  project,
  liked,
  onLike,
  onAddComment,
  initialImage,
}) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(initialImage);
  const [draft, setDraft] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const images = project.image_urls ?? [];
  const comments = project.comments ?? [];
  const likeCount = project.like_count ?? 0;
  const next = (direction) =>
    setIndex(
      (current) => (current + direction + images.length) % images.length,
    );
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const total = images.length;
    const onKey = (event) => {
      if (event.key === "Escape") navigate("/");
      if (event.key === "ArrowLeft")
        setIndex((current) => (current - 1 + total) % total);
      if (event.key === "ArrowRight")
        setIndex((current) => (current + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [navigate, images.length]);
  const submitComment = async (event) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;
    await onAddComment(project.id, content);
    setDraft("");
  };
  const sharePost = async () => {
    const url = `${window.location.origin}/post/${project.id}?img=0`;
    await navigator.clipboard?.writeText(url);
    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 1600);
  };
  return (
    <div
      className="fixed inset-0 z-40 bg-black/90 flex items-center justify-center"
      onClick={() => navigate("/")}
    >
      <div
        className="relative w-full h-full bg-black flex flex-col md:flex-row overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => navigate("/")}
          className="absolute left-3 top-3 z-10 w-11 h-11 rounded-full bg-black/50 text-white flex items-center justify-center"
        >
          <X size={24} />
        </button>
        <div
          className="relative flex-1 min-h-[42vh] md:min-h-0 bg-black flex items-center justify-center"
          onTouchStart={(event) =>
            (event.currentTarget.startX = event.touches[0].clientX)
          }
          onTouchEnd={(event) => {
            const delta =
              event.changedTouches[0].clientX - event.currentTarget.startX;
            if (Math.abs(delta) > 45) next(delta > 0 ? -1 : 1);
          }}
        >
          {images.length > 0 && (
            <img
              className="w-full h-full object-contain transition-opacity duration-200"
              src={images[index]}
              alt={project.title}
            />
          )}
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => next(-1)}
                className="absolute left-3 w-11 h-11 rounded-full bg-black/30 text-white flex items-center justify-center"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => next(1)}
                className="absolute right-3 w-11 h-11 rounded-full bg-black/30 text-white flex items-center justify-center"
              >
                <ChevronRight size={28} />
              </button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-[13px]">
                {index + 1} / {images.length}
              </span>
            </>
          )}
        </div>
        <div className="w-full md:w-[24%] md:min-w-75 bg-white text-text-primary flex flex-col min-h-[52vh] md:min-h-0">
          <div className="p-3 flex items-center gap-2">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={avatarImg}
              alt="Carl Salido Madrigal"
            />
            <div className="flex-1">
              <div className="font-poppins font-semibold text-[15px]">
                Carl Salido Madrigal
              </div>
              <div className="text-[13px] text-text-secondary">
                completed a project · {formatMonthYear(project.completed_at)}
              </div>
            </div>
            <MoreHorizontal size={20} className="text-text-secondary" />
          </div>
          <div className="border-t border-divider overflow-y-auto flex-1">
            <div className="p-3 text-[15px] leading-[1.35]">
              <strong className="font-poppins font-semibold">
                {project.title}
              </strong>
              {(project.tech_stack ?? []).length > 0 && (
                <div className="text-text-secondary mt-1">
                  {project.tech_stack.join(" · ")}
                </div>
              )}
              {project.description && (
                <div className="mt-2 text-text-primary">
                  {project.description}
                </div>
              )}
              <ul className="mt-2 space-y-2 list-disc ml-5">
                {(project.features ?? []).map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            {(project.project_url || project.repo_url) && (
              <a
                href={project.project_url || project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="mx-3 mb-3 border border-divider rounded-lg flex items-center gap-3 overflow-hidden hover:bg-canvas"
              >
                {images[0] ? (
                  <img
                    className="w-24 h-16 object-cover"
                    src={images[0]}
                    alt=""
                  />
                ) : (
                  <div className="w-24 h-16 flex items-center justify-center bg-canvas text-text-tertiary">
                    <LinkIcon size={20} />
                  </div>
                )}
                <div className="py-2 min-w-0">
                  <div className="font-semibold truncate">
                    {project.project_url ? "View project" : "View repository"}
                  </div>
                  <div className="text-sm text-text-secondary flex gap-1 items-center truncate">
                    {domainOf(project.project_url || project.repo_url)}{" "}
                    <ExternalLink size={11} />
                  </div>
                </div>
              </a>
            )}
            <div className="px-3 py-2 flex items-center gap-1 text-[13px] text-text-secondary">
              <Heart size={15} fill="#F3425F" color="#F3425F" /> {likeCount}{" "}
              likes <span className="ml-auto">{comments.length} comments</span>
            </div>
            <div className="border-t border-divider h-10 flex">
              <button
                onClick={() => onLike(project.id)}
                className={`flex-1 flex items-center justify-center gap-1 text-sm font-semibold ${liked ? "text-heart-pink" : "text-text-secondary"}`}
              >
                <Heart size={18} fill={liked ? "currentColor" : "none"} /> Like
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 text-sm font-semibold text-text-secondary">
                <MessageCircle size={18} /> Comment
              </button>
              <div className="relative flex-1">
                <button
                  onClick={sharePost}
                  className="w-full h-full flex items-center justify-center gap-1 text-sm font-semibold text-text-secondary"
                >
                  <Share2 size={18} /> Share
                </button>
                {shareCopied && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 rounded-lg bg-fb-blue text-white px-3 py-1.5 text-xs font-semibold whitespace-nowrap flex items-center gap-1">
                    <Check size={13} /> Copied
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-divider p-3 space-y-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-fb-blue text-white flex items-center justify-center font-poppins font-semibold text-sm">
                    A
                  </span>
                  <div className="bg-canvas rounded-2xl px-3 py-2">
                    <div className="font-poppins font-semibold text-[13px]">
                      Anonymous
                    </div>
                    <div className="text-sm">{comment.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form
            onSubmit={submitComment}
            className="sticky bottom-0 p-2 bg-white border-t border-divider flex items-center gap-2"
          >
            <span className="w-8 h-8 shrink-0 rounded-full bg-fb-blue text-white flex items-center justify-center font-poppins font-semibold text-sm">
              A
            </span>
            <div className="flex items-center gap-2 bg-canvas rounded-full px-3 py-1 flex-1">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="bg-transparent outline-none flex-1 text-sm py-1"
                placeholder="Write a comment..."
              />
              <button className="text-fb-blue">
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
