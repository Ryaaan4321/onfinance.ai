import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { created, badRequest, serverError } from '@/lib/apiResponse'
import { cookies } from "next/headers";
export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const { email, name, password } = await req.json();
        if (!email || !password) {
            return badRequest("email and password are required")
        }
        const existing = await prisma.user.findUnique({
            where: { email }
        })
        if (existing) return badRequest("email already in use")
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { email, name, password: hashedPassword }
        })
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
        return created({ userId: user.id });
    } catch (e) {
        return serverError(e);
    }
}