import { useState } from "react";
import { ImageViewer } from "even-toolkit/web";

interface ZoomableImageProps {
  /** One or more images. The first is shown as the thumbnail. */
  images: string[];
  alt?: string;
  /** Classes for the thumbnail image. */
  className?: string;
}

/**
 * A thumbnail that opens a full-screen zoom modal (ImageViewer) when clicked.
 * When given multiple images, the modal lets you swipe/navigate between them.
 */
export function ZoomableImage({ images, alt = "", className }: ZoomableImageProps) {
  const [index, setIndex] = useState<number | null>(null);
  if (images.length === 0) return null;
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIndex(0);
        }}
        className="relative block border-0 bg-transparent p-0 cursor-pointer"
        aria-label={alt || "Open image"}
      >
        <img src={images[0]} alt={alt} className={className} />
        {images.length > 1 && (
          <span className="absolute bottom-0.5 right-0.5 rounded-[4px] bg-overlay px-1 text-[11px] tracking-[-0.11px] text-text-highlight tabular-nums">
            {images.length}
          </span>
        )}
      </button>
      {index !== null && (
        <ImageViewer
          images={images.map((src) => ({ src, alt }))}
          currentIndex={index}
          onClose={() => setIndex(null)}
          onNavigate={setIndex}
        />
      )}
    </>
  );
}
