"use client";

import animation from "./scan-animation.json";
import Lottie from "lottie-react";

export const ScanAnimation = () => {
  return <Lottie animationData={animation} className="size-[400px]" />;
};
