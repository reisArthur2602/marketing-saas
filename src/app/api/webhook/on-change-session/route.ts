import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

interface UpdateSessionProps {
  sessionId: string;
  connected: boolean;
  qrCode: string | null;
}

const updateSession = async (data: UpdateSessionProps) => {
  "use server";
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

export async function POST(request: NextRequest) {
  try {
    const body: Body = await request.json();
    const { session } = body;

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
}
