import { prisma } from '@/lib/prisma'
import { ok, created, notFound, serverError, badRequest } from '@/lib/apiResponse'


export async function GET() {
    try {
        const regulations = await prisma.regulation.findMany({
            include: { rules: true }
        })
        return ok(regulations)
    } catch(e) {
        return serverError(e)
    }
}
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { title, authority, content } = body

        if (!title || !authority || !content) {
            return badRequest("title, authority and content are required")
        }

        const regulation = await prisma.regulation.create({
            data: { title, authority, content }
        })
        return created(regulation)
    } catch (e: any) {
        return serverError(e)
    }
}