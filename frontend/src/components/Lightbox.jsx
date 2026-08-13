import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({ images, index, onClose, onChange }) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close gallery"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 text-white"
      >
        <X size={28} />
      </button>
      <button
        type="button"
        aria-label="Previous image"
        onClick={(event) => {
          event.stopPropagation();
          onChange((index - 1 + images.length) % images.length);
        }}
        className="absolute left-3 sm:left-8 text-white"
      >
        <ChevronLeft size={36} />
      </button>
      <img
        onClick={(event) => event.stopPropagation()}
        className="w-[96vw] h-[94vh] object-contain"
        src={images[index]}
        alt="Project gallery"
      />
      <button
        type="button"
        aria-label="Next image"
        onClick={(event) => {
          event.stopPropagation();
          onChange((index + 1) % images.length);
        }}
        className="absolute right-3 sm:right-8 text-white"
      >
        <ChevronRight size={36} />
      </button>
      <span className="absolute bottom-4 text-white text-sm">
        {index + 1} / {images.length}
      </span>
    </div>,
    document.body,
  );
}
