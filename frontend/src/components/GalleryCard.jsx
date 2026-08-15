import { Images } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { projects } from "../data/projects";

export default function GalleryCard() {
  const navigate = useNavigate();
  const all = projects.flatMap((project) =>
    project.images.map((src, i) => ({ src, projectId: project.id, index: i })),
  );
  return (
    <div className="bg-white rounded-lg p-3">
      <h2 className="font-poppins font-bold text-xl flex gap-2 items-center mb-3">
        <Images size={21} /> Gallery
      </h2>
      <div className="grid grid-cols-3 gap-1">
        {all.map(({ src, projectId, index }) => (
          <button
            type="button"
            key={src}
            onClick={() => navigate(`/post/${projectId}?img=${index}`)}
            className="aspect-square overflow-hidden rounded-sm hover:opacity-90"
          >
            <img className="w-full h-full object-cover" src={src} alt="Project screenshot" />
          </button>
        ))}
      </div>
    </div>
  );
}
