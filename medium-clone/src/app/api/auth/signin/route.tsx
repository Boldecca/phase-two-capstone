import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { validateEmail } from '@/lib/validators';

// Mock user database
const users = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Find user (in production, use real database)
    const user = users.get(email.toLowerCase());

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = await signToken({
      userId: user.id,
      email: user.email,
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword, token });
  } catch (error) {
    return NextResponse.json(
      { error: 'Sign in failed' },
      { status: 500 }
    );
  }
}
