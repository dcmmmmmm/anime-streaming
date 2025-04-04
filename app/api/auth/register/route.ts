import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
// POST /api/auth/register
export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    // kiểm tra nếu tồn tại người dùng có email này
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Người dùng đã tồn tại' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // tạo người dùng
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
      },
    });
    console.log(newUser);


    return NextResponse.json({ message: 'Đăng kí thành công, Hãy kiểm tra Email Xác thực tài khoản' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error,
        message: "Lỗi Kết nối",
      },
      { status: 500 }
    );
  } 
}