import { prisma } from "@/lib/prisma"
import { ok, notFound, serverError } from "@/lib/apiResponse"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const regulation = await prisma.regulation.findUnique({
      where: { id: params.id },
      include: { rules: true }
    })
    if (!regulation) return notFound("Regulation not found")
    return ok(regulation)
  } catch(e) {
    return serverError(e)
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.regulation.delete({ where: { id: params.id } })
    return ok({ message: "Deleted" })
  } catch (e){
    return serverError(e)
  }
}