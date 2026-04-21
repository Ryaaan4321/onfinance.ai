import { prisma } from '@/lib/prisma'
import { ok, created, notFound, serverError, badRequest } from '@/lib/apiResponse'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { description, condition, severity, penaltyPerDay, maxPenalty } = await req.json()
  
  const rule = await prisma.rule.create({
    data: {
      regulationId: params.id,  
      description,
      condition,
      severity,
      penaltyPerDay,
      maxPenalty
    }
  })
  return created(rule)
}
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try{
        const regulation=await prisma.regulation.findUnique({
            where:{id:params.id}
        })
        if(!regulation){
            return notFound("regulation not found")
        }
        const rules=await prisma.rule.findMany({
            where:{regulationId:params.id}
        })
        return ok(rules)
    }catch(e){
        return serverError(e);
    }
}