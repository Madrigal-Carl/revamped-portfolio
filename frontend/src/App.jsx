import { useEffect, useState } from "react";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { Eye } from "lucide-react";
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

function ProfilePage({ postState, setPostState }) {
  return (
    <main className="max-w-350 mx-auto">
      <ProfileHeader />
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
  const [postState, setPostState] = useState(initialState);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const next = Number(localStorage.getItem("portfolio-visits") || 1204) + 1;
    localStorage.setItem("portfolio-visits", next);
    setVisits(next);
  }, []);
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
            <ProfilePage postState={postState} setPostState={setPostState} />
          }
        />
      </Routes>
      <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-white shadow-lg border-2 border-fb-blue px-4 py-2.5 text-sm font-semibold text-fb-blue">
        <Eye size={18} /> {visits.toLocaleString()} profile views
      </div>
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
