import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { NextRequest, NextResponse } from "next/server";

type BodyResponse = {
  session: {
    id: string;
    qrCode: string | null;
    connected: boolean;
  };
};

export const POST = async (request: NextRequest) => {
  const { session } = (await request.json()) as BodyResponse;

  await prisma.whatsAppSession.update({
    where: {
      sessionId: session?.id as string,
    },
    data: {
      connected: session.connected,
      qrCode: session.qrCode,
    },
  });
  revalidatePath("/dashboard/session");

  return NextResponse.json({ success: true });
};
