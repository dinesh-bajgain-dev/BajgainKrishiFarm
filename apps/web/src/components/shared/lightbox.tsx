"use client";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export interface LightboxSlide {
  src: string;
  title?: string;
  description?: string;
}

export function ImageLightbox({
  slides,
  index,
  open,
  onClose,
}: {
  slides: LightboxSlide[];
  index: number;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      styles={{ container: { backgroundColor: "rgba(20, 24, 18, 0.95)" } }}
    />
  );
}
