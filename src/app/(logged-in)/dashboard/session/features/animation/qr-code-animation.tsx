"use client";

import Lottie from "lottie-react";
import animationData from "../animation/scan-qr.json";

import { LucideLoaderCircle } from "lucide-react";
import { AutoRefresh } from "../auto-refresh";

export const QrCodeAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center relative ">
      <AutoRefresh active intervalMs={5000} />
      <Lottie animationData={animationData} className="size-[300px]" />
      <div className="text-primary flex items-center gap-2 absolute top-65 right-28">
        <LucideLoaderCircle className="size-7 animate-spin" />
        <h4>Aguardando conexão</h4>
      </div>
    </div>
  );
};
