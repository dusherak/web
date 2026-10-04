import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Image wrapper used for every product / component visual.
 * Fills its (positioned) parent and keeps aspect ratio, so any square-ish PNG, JPG,
 * WebP or SVG dropped into products.ts just works. SVGs skip the optimiser.
 */
export function Media({
  src,
  alt,
  className,
  priority,
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.endsWith(".svg")}
      draggable={false}
      className={cn("object-contain select-none", className)}
    />
  );
}
