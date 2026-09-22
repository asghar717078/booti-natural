import { NextResponse } from 'next/server';
import { signToken, ADMIN_COOKIE } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const validEmail = process.env.ADMIN_EMAIL;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (
      !email || !password ||
      email.trim().toLowerCase() !== validEmail?.toLowerCase() ||
      password !== validPassword
    ) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await signToken({ email, role: 'admin' });

    const response = NextResponse.json({ success: true });

    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[POST /api/admin/auth/login]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
