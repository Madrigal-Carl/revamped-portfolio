import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ExternalLink,
  LinkIcon,
  Send,
  Check,
} from "lucide-react";
import ImageGrid from "./ImageGrid";
import { useNavigate } from "react-router-dom";
import { formatMonthYear } from "../hooks/useProjects";

const domainOf = (url) => {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export default function PostCard({ project, liked, onLike, onAddComment }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const images = project.image_urls ?? [];
  const comments = project.comments ?? [];
  const likeCount = project.like_count ?? 0;
  const caption = (
    <>
      <strong className="font-semibold">{project.title}</strong>
      {(project.tech_stack ?? []).length > 0 && (
        <div className="mt-1 text-text-secondary">
          {project.tech_stack.join(" · ")}
        </div>
      )}
      {project.description && (
        <p className="mt-2 text-text-primary">{project.description}</p>
      )}
      {(project.features ?? []).length > 0 && (
        <div className="mt-2 space-y-1">
          {(project.features ?? []).map((item) => (
            <div key={item}>• {item}</div>
          ))}
        </div>
      )}
    </>
  );
  const submitComment = async (e) => {
    e.preventDefault();
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
    <article className="bg-white rounded-lg overflow-hidden">
      <div className="p-3 flex items-center gap-2">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src="https://picsum.photos/seed/carlavatar/300/300"
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
      <div className="px-3 pb-3 text-[15px] leading-[1.35]">
        {expanded ? caption : <div className="line-clamp-4">{caption}</div>}
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-1 font-semibold text-text-secondary"
        >
          {expanded ? "See less" : "... See more"}
        </button>
      </div>
      {images.length > 0 && (
        <ImageGrid
          images={images}
          onImageClick={(i) => navigate(`/post/${project.id}?img=${i}`)}
        />
      )}
      {(project.project_url || project.repo_url) && (
        <a
          href={project.project_url || project.repo_url}
          target="_blank"
          rel="noreferrer"
          className="mx-3 my-3 border border-divider rounded-lg flex items-center gap-3 overflow-hidden hover:bg-canvas"
        >
          {images[0] ? (
            <img className="w-24 h-16 object-cover" src={images[0]} alt="" />
          ) : (
            <div className="w-24 h-16 flex items-center justify-center bg-canvas text-text-tertiary">
              <LinkIcon size={20} />
            </div>
          )}
          <div className="py-2 min-w-0">
            <div className="font-semibold text-sm truncate">
              {project.project_url ? "View project" : "View repository"}
            </div>
            <div className="text-xs text-text-secondary flex gap-1 items-center truncate">
              {domainOf(project.project_url || project.repo_url)}{" "}
              <ExternalLink size={11} />
            </div>
          </div>
        </a>
      )}
      <div className="px-3 py-2 flex items-center gap-1 text-[13px] text-text-secondary">
        <Heart size={15} fill="#F3425F" color="#F3425F" /> {likeCount} likes{" "}
        <span className="ml-auto">{comments.length} comments</span>
      </div>
      <div className="border-t border-divider h-10 flex">
        <button
          onClick={() => onLike(project.id)}
          className={`flex-1 flex justify-center items-center gap-2 text-sm font-semibold ${liked ? "text-heart-pink" : "text-text-secondary"}`}
        >
          <Heart
            className={liked ? "heart-pop" : ""}
            size={18}
            fill={liked ? "currentColor" : "none"}
          />{" "}
          Like
        </button>
        <button
          onClick={() => setCommentsOpen(!commentsOpen)}
          className="flex-1 flex justify-center items-center gap-2 text-sm font-semibold text-text-secondary"
        >
          <MessageCircle size={18} /> Comment
        </button>
        <div className="relative flex-1">
          <button
            onClick={sharePost}
            className="w-full h-full flex justify-center items-center gap-2 text-sm font-semibold text-text-secondary"
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
      {commentsOpen && (
        <div className="border-t border-divider px-3 py-2 space-y-2">
          <div className="space-y-1">
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
          <form
            onSubmit={submitComment}
            className="flex items-center gap-2 bg-canvas rounded-full px-3 py-1"
          >
            <span className="w-7 h-7 shrink-0 rounded-full bg-fb-blue text-white flex items-center justify-center font-poppins font-semibold text-xs">
              A
            </span>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm py-1"
              placeholder="Write a comment..."
            />
            <button className="text-fb-blue">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
