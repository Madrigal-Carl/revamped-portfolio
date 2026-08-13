import { useState } from "react";
import Lightbox from "./Lightbox";

export default function ImageGrid({ images, onImageClick }) {
  const [index, setIndex] = useState(null);
  const shown = images.slice(0, 4);
  const extra = images.length - 4;
  return (
    <>
      <div
        className={`grid gap-0.5 overflow-hidden ${images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-2 grid-rows-2"}`}
      >
        {shown.map((src, i) => (
          <button
            type="button"
            key={src}
            onClick={() => (onImageClick ? onImageClick(i) : setIndex(i))}
            className={`relative min-h-0 overflow-hidden ${images.length === 3 && i === 0 ? "row-span-2" : ""}`}
          >
            <img
              className="w-full h-full object-cover aspect-16/10"
              src={src}
              alt="Project screenshot"
            />
            {extra > 0 && i === 3 && (
              <span className="absolute inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center text-white text-xl font-semibold">
                +{extra} more
              </span>
            )}
          </button>
        ))}
      </div>
      {index !== null && (
        <Lightbox
          images={images}
          index={index}
          onClose={() => setIndex(null)}
          onChange={setIndex}
        />
      )}
    </>
  );
}
