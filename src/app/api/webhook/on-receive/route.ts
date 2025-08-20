import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  // const keywordMatched = await prisma.keyword.findFirst({
  //   where: {
  //     word: { equals: body.text.message, mode: "insensitive" },
  //     campaigns: {
  //       some: {
  //         isActive: true,
  //       },
  //     },
  //   },
  //   include: {
  //     campaigns: {
  //       where: {
  //         isActive: true,
  //       },
  //       include: {
  //         exceptions: true,
  //         template: true,
  //       },
  //     },
  //   },
  // });

  // if (!keywordMatched) {
  //   return { text: "Nenhuma campanha associada à palavra-chave." };
  // }

  // const now = new Date();
  // const activeCampaign = keywordMatched.campaigns.find((c) => {
  //   const isException = c.exceptions.some((ex) => {
  //     const exDate = new Date(ex.date);
  //     return exDate.toDateString() === now.toDateString();
  //   });
  //   return !isException;
  // });

  // if (!activeCampaign) {
  //   return { text: "Nenhuma campanha ativa no momento (exceção)." };
  // }
  // console.log(activeCampaign.template.text, body);

  return NextResponse.json({ success: true });
};
