import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { NextRequest, NextResponse } from "next/server";

interface UpdateSessionProps {
  sessionId: string;
  connected: boolean;
  qrCode: string | null;
}

const updateSession = async (data: UpdateSessionProps) => {
  await prisma.whatsAppSession.update({
    where: {
      sessionId: data.sessionId,
    },
    data: {
      connected: data.connected,
      qrCode: data.qrCode,
    },
  });
  revalidatePath("/dashboard/session");
};

interface Body {
  session: {
    id: string;
    qrCode: string | null;
    connected: boolean;
  };
}

export const POST = async (request: NextRequest) => {
  try {
    const { session } = (await request.json()) as Body;

    if (!session) return NextResponse.json({ success: false }, { status: 400 });

    await updateSession({
      sessionId: session.id,
      connected: session.connected,
      qrCode: session.qrCode,
    });

    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
