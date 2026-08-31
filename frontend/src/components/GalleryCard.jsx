import { Images } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GalleryCard({ projects }) {
  const navigate = useNavigate();
  const groups = (projects ?? [])
    .map((project) => {
      const allImages = project.image_urls ?? [];
      return {
        projectId: project.id,
        images: allImages.slice(0, 3),
        extra: allImages.length - 3,
      };
    })
    .filter((group) => group.images.length > 0);

  return (
    <div className="bg-white rounded-lg p-3">
      <h2 className="font-poppins font-bold text-xl flex gap-2 items-center mb-3">
        <Images size={21} /> Gallery
      </h2>
      {groups.length === 0 ? (
        <p className="text-sm text-text-secondary">No images yet.</p>
      ) : (
        <div className="space-y-3">
          {groups.map((group, gi) => (
            <div key={group.projectId}>
              {gi > 0 && <div className="h-px bg-divider mb-3" />}
              <div className="grid grid-cols-3 gap-1">
                {group.images.map((src, i) => (
                  <button
                    type="button"
                    key={`${group.projectId}-${i}`}
                    onClick={() =>
                      navigate(`/post/${group.projectId}?img=${i}`)
                    }
                    className="relative aspect-square overflow-hidden rounded-sm hover:opacity-90"
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={src}
                      alt="Project screenshot"
                    />
                    {group.extra > 0 && i === group.images.length - 1 && (
                      <span className="absolute inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center text-white text-sm sm:text-base font-semibold">
                        +{group.extra} more
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
