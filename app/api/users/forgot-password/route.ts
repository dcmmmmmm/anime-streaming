// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return a success message to avoid exposing user existence
    if (user) {
      await sendPasswordResetEmail(user.id, user.email);
    }
    return NextResponse.json({
      message: "If the email exists, you will receive a password reset email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
