"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface DeleteWhatsAppSessionProps {
  sessionId: string;
}

export const deleteWhatsAppSession = async ({
  sessionId,
}: DeleteWhatsAppSessionProps) => {
  await prisma.whatsAppSession.delete({
    where: { sessionId },
  });

  revalidatePath("/dashboard/session");
};
