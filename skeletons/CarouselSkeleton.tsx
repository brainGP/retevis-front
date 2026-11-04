import React from "react";

const CarouselSkeleton = () => {
  return (
    <div className="relative z-0 h-[30vh] w-full animate-pulse bg-slate-200/70 sm:h-[40vh] md:h-[60vh]" aria-hidden="true">
      <div className="absolute bottom-5 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-white/70 sm:bottom-7" />
    </div>
  );
};

export default CarouselSkeleton;
