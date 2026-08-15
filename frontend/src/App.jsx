import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import ProfileHeader from "./components/ProfileHeader";
import Sidebar from "./components/Sidebar";
import PostFeed from "./components/PostFeed";
import PostDetailView from "./components/PostDetailView";
import { projects } from "./data/projects";

const initialState = Object.fromEntries(
  projects.map((project, index) => [
    project.id,
    {
      liked: false,
      comments:
        index === 0
          ? [
              {
                name: "Mika Reyes",
                body: "This platform looks incredibly useful for the community.",
              },
            ]
          : [{ name: "Alex Santos", body: "Clean work, Carl!" }],
    },
  ]),
);

function ProfilePage({
  postState,
  setPostState,
  headerRef,
  visits,
  likes,
  liked,
  onLike,
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
        <Sidebar />
        <PostFeed
          postState={postState}
          setPostState={(id, value) =>
            setPostState((current) => ({ ...current, [id]: value }))
          }
        />
      </div>
    </main>
  );
}

function AppContent() {
  const [visits, setVisits] = useState(1204);
  const [likes, setLikes] = useState(1204);
  const [liked, setLiked] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [postState, setPostState] = useState(initialState);
  const headerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const next = Number(localStorage.getItem("portfolio-visits") || 1204) + 1;
    localStorage.setItem("portfolio-visits", next);
    setVisits(next);
  }, []);
  useEffect(() => {
    const stored = Number(localStorage.getItem("portfolio-likes") || 1204);
    setLikes(stored);
  }, []);
  useEffect(() => {
    setLiked(localStorage.getItem("portfolio-liked") === "1");
  }, []);
  const onLike = () => {
    setLiked((current) => {
      const next = !current;
      localStorage.setItem("portfolio-liked", next ? "1" : "0");
      return next;
    });
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeaderVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, [headerRef.current]);
  const detail = location.pathname.match(/^\/post\/([^/]+)/);
  const project = detail && projects.find((item) => item.id === detail[1]);
  const image = Number(new URLSearchParams(location.search).get("img")) || 0;
  useEffect(() => {
    if (detail && !project) navigate("/");
  }, [detail, project, navigate]);
  return (
    <>
      <Routes>
        <Route
          path="*"
          element={
            <ProfilePage
              postState={postState}
              setPostState={setPostState}
              headerRef={headerRef}
              visits={visits}
              likes={likes}
              liked={liked}
              onLike={onLike}
            />
          }
        />
      </Routes>
      <button
        onClick={onLike}
        className={`fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full shadow-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${liked ? "bg-heart-pink text-white" : "bg-white ring-2 ring-inset ring-heart-pink text-heart-pink"} ${!headerVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
      >
        <Heart size={18} fill={liked ? "currentColor" : "none"} />{" "}
        {liked ? likes + 1 : likes} likes
      </button>
      {project && (
        <PostDetailView
          project={project}
          initialImage={Math.min(image, project.images.length - 1)}
          postState={postState[project.id]}
          setPostState={(value) =>
            setPostState((current) => ({ ...current, [project.id]: value }))
          }
        />
      )}
    </>
  );
}

export default function App() {
  return <AppContent />;
}
