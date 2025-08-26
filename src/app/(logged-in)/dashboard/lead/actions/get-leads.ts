'use server'

import { currentUser } from "@/lib/auth-js"
import { prisma } from "@/lib/prisma";

export const getLeads = async()=> {
const user = await currentUser()
if(!user) return null;

const leads = await prisma.lead.findMany({where:{userId:user.id}})
return leads

}