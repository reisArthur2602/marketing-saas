'use server'

import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getKeywords = cache( async({userId}:{userId:string}) =>{
 const keywords = await prisma.keyword.findMany({
      where: { userId },
      include: { campaigns: { include: { template: true, exceptions: true } } },
    });

    return keywords
})