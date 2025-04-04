import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// get particular user
export async function GET(request: Request, { params }: { params: { id: string }}) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
        role: "USER",
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to get User", error },
      { status: 500 }
    );
  }
}

// update user
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, imageUrl} =
      await request.json();

    const existingUser = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: "Not Found",
        },
        { status: 404 }
      );
    }
    const updateUser = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        name: name,
        imageUrl: imageUrl,
      },
    });
    console.log(updateUser);
    return NextResponse.json(updateUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to update User", error },
      { status: 500 }
    );
  }
}
// delete user
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: params.id,
        role: "USER",
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: "User Not Found",
        },
        { status: 404 }
      );
    }
    const deletedUser = await prisma.user.delete({
      where: {
        id: params.id,
        role: "USER",
      },
    });

    return NextResponse.json(deletedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to Delete User", error },
      { status: 500 }
    );
  }
}