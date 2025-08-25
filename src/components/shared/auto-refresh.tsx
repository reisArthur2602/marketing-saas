"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AutoRefreshProps {
  active: boolean;
  intervalMs?: number;
}

export const AutoRefresh = ({
  active,
  intervalMs = 2000,
}: AutoRefreshProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;

    const intervalId = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [active, intervalMs, router]);

  return null;
};
