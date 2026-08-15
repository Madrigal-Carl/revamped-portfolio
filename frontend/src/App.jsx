import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { Heart } from "lucide-react";
import ProfileHeader from "./components/ProfileHeader";
import Sidebar from "./components/Sidebar";
import PostFeed from "./components/PostFeed";
import PostDetailView from "./components/PostDetailView";
import { useProjects } from "./hooks/useProjects";
import { useSiteStats } from "./hooks/useSiteStats";

function ProfilePage({
  headerRef,
  visits,
  likes,
  liked,
  onLike,
  projects,
  likedIds,
  likeProject,
  addComment,
  loading,
  error,
}) {
  return (
    <main className="max-w-350 mx-auto">
      <ProfileHeader
        sectionRef={headerRef}
        visits={visits}
        likes={likes}
        liked={liked}
        onLike={onLike}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] gap-2 p-2">
        <Sidebar projects={projects} />
        <PostFeed
          projects={projects}
          likedIds={likedIds}
          onLike={likeProject}
          onAddComment={addComment}
          loading={loading}
          error={error}
        />
      </div>
    </main>
  );
}

function AppContent() {
  const [headerVisible, setHeaderVisible] = useState(true);
  const headerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { projects, likedIds, loading, error, likeProject, addComment } =
    useProjects();
  const {
    viewCount,
    likeCount,
    liked,
    likeSite,
  } = useSiteStats();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeaderVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);
  const detail = location.pathname.match(/^\/post\/([^/]+)/);
  const project = detail && projects.find((item) => item.id === detail[1]);
  const image = Number(new URLSearchParams(location.search).get("img")) || 0;
  useEffect(() => {
    if (detail && !loading && !project) navigate("/");
  }, [detail, loading, project, navigate]);
  return (
    <>
      <Routes>
        <Route
          path="*"
          element={
            <ProfilePage
              headerRef={headerRef}
              visits={viewCount}
              likes={likeCount}
              liked={liked}
              onLike={likeSite}
              projects={projects}
              likedIds={likedIds}
              likeProject={likeProject}
              addComment={addComment}
              loading={loading}
              error={error}
            />
          }
        />
      </Routes>
      <button
        onClick={likeSite}
        className={`fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full shadow-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${liked ? "bg-heart-pink text-white" : "bg-white ring-2 ring-inset ring-heart-pink text-heart-pink"} ${!headerVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
      >
        <Heart size={18} fill={liked ? "currentColor" : "none"} />{" "}
        {likeCount} likes
      </button>
      {project && (
        <PostDetailView
          project={project}
          liked={likedIds.includes(project.id)}
          onLike={likeProject}
          onAddComment={addComment}
          initialImage={Math.min(image, (project.image_urls ?? []).length - 1)}
        />
      )}
    </>
  );
}

export default function App() {
  return <AppContent />;
}
