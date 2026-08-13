import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Globe2,
  ExternalLink,
  Send,
} from "lucide-react";
import ImageGrid from "./ImageGrid";
import { useNavigate } from "react-router-dom";

export default function PostCard({ project, number, postState, setPostState }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const { liked, comments } = postState;
  const caption = (
    <>
      <strong className="font-semibold">{project.title}</strong>
      <br />
      <span className="text-text-secondary">{project.stack}</span>
      <br />
      {project.bullets.map((item) => (
        <span className="block" key={item}>
          • {item}
        </span>
      ))}
    </>
  );
  const addComment = (e) => {
    e.preventDefault();
    if (draft.trim()) {
      setPostState({
        ...postState,
        comments: [...comments, { name: "You", body: draft.trim() }],
      });
      setDraft("");
    }
  };
  return (
    <article className="bg-white rounded-lg overflow-hidden pressable">
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
            posted a project · {project.date} ·{" "}
            <Globe2 className="inline" size={12} /> Public
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
      <ImageGrid
        images={project.images}
        onImageClick={(i) => navigate(`/post/${project.id}?img=${i}`)}
      />
      <a
        href={project.link}
        target="_blank"
        rel="noreferrer"
        className="mx-3 my-3 border border-divider rounded-lg flex items-center gap-3 overflow-hidden hover:bg-canvas"
      >
        <img
          className="w-24 h-16 object-cover"
          src={project.images[0]}
          alt=""
        />
        <div className="py-2">
          <div className="font-semibold text-sm">
            View {project.title.split(" – ")[0]}
          </div>
          <div className="text-xs text-text-secondary flex gap-1 items-center">
            {project.domain} <ExternalLink size={11} />
          </div>
        </div>
      </a>
      <div className="px-3 py-2 flex items-center gap-1 text-[13px] text-text-secondary">
        <Heart size={15} fill="#F3425F" color="#F3425F" /> {liked ? 25 : 24}{" "}
        likes{" "}
        <span className="ml-auto">
          {comments.length} comments · {number + 3} shares
        </span>
      </div>
      <div className="border-t border-divider h-10 flex">
        <button
          onClick={() => setPostState({ ...postState, liked: !liked })}
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
        <button className="flex-1 flex justify-center items-center gap-2 text-sm font-semibold text-text-secondary">
          <Share2 size={18} /> Share
        </button>
      </div>
      {commentsOpen && (
        <div className="border-t border-divider px-3 py-2 space-y-2">
          <div className="space-y-1">
            {comments.map((comment, i) => (
              <div
                key={`${comment.name}-${i}`}
                className="flex items-start gap-2"
              >
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
            onSubmit={addComment}
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
