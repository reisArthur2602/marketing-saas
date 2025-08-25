"use server";

import { zapIO } from "@/http/zapIO";

import { revalidatePath } from "next/cache";

interface RefreshConnectionProps {
  sessionId: string;
}

export const refreshConnection = async ({
  sessionId,
}: RefreshConnectionProps) => {
  const refresh = await zapIO.refresh({ sessionId });
  if (!refresh.success) return;
  revalidatePath("/dashboard/session");
};
