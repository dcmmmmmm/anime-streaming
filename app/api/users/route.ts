import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";

// POST /api/auth/register
export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Check if a user already exists with this email.
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 400 }
      );
    }

    // Hash the password before saving.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database.
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
    });

    // Send verification email asynchronously.
    await sendVerificationEmail(user.id, user.email);

    return NextResponse.json(
      { message: "User registered successfully. Please check your email to verify your account." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } 
}

export async function GET() {
  try {
    const user = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        watchLater: true,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to get Users", error },
      { status: 500 }
    );
  }
}