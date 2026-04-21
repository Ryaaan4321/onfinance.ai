import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"

const SECRET = process.env.JWT_SECRET!

export function getUserFromToken(req: NextRequest): string {
  const authHeader = req.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided")
  }

  const token = authHeader.split(" ")[1]
  const decoded = jwt.verify(token, SECRET) as { userId: string }
  return decoded.userId
}