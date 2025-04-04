// app/api/auth/verify-email/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token missing." }, { status: 400 });
  }

  try {
    // Verify the JWT token
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    const { userId } = payload as { userId: string };

    // Update the user's record to mark the email as verified
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });

    return NextResponse.json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Email Verification Error:", error);
    return NextResponse.json(
      { error: "Invalid or expired token." },
      { status: 400 }
    );
  }
}
