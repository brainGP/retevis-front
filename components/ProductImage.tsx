"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

const FALLBACK_IMAGE = "/noresult.png";

export default function ProductImage({ src, alt, ...props }: Omit<ImageProps, "src"> & { src?: string | null }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <Image
      {...props}
      src={!failed && src ? src : FALLBACK_IMAGE}
      alt={alt || "Бүтээгдэхүүний зураг"}
      onError={() => { if (!failed) setFailed(true); }}
    />
  );
}
