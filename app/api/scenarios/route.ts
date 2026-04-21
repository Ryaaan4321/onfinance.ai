import { badRequest, serverError, unauthorized, created } from "@/lib/apiResponse";
import { getUserFromToken } from "@/lib/auth";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma'
export async function POST(req: NextRequest) {
    try {
        const createdById = getUserFromToken(req);
        if (!createdById) {
            return unauthorized("user is not logged in!")
        }
        const { name, description, daysOverdue, breachedRuleId } = await req.json();
        if (!name || !daysOverdue || !breachedRuleId) {
            return badRequest("the important entities are not defined")
        }
        const scenario = await prisma.scenario.create({
            data: { name, description, daysOverdue, breachedRuleId, createdById }
        })
        return created(scenario)
    } catch (e) {
        return serverError(e);
    }
}