// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { signJwt } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const { email, password, rememberMe } = await req.json();
  
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }
  
    // Validate password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }
  
    return NextResponse.json({ message: 'Logged in successfully' });
    
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }

}
