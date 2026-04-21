import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { created, badRequest, serverError, ok } from '@/lib/apiResponse'
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const { email, password } = await req.json()
        if (!email || !password) {
            return badRequest("email and password are required")
        }
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) return badRequest("invalid credentials")
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) return badRequest("invalid credentials")
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        )
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });
        return ok({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        })
    } catch (e) {
        return serverError(e)
    }
}