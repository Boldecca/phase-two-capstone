import { NextRequest, NextResponse } from 'next/server';
import { signToken, JWTPayload } from '@/lib/auth';
import { validateEmail, validatePassword, validateUsername } from '@/lib/validators';
import { User } from '@/lib/types';

// Mock user database - replace with real database in production
const users: Map<string, User & { password: string }> = new Map();

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, name } = await request.json();

    // Validation
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Password validation failed', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    if (!validateUsername(username)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 characters, alphanumeric with dashes/underscores' },
        { status: 400 }
      );
    }

    // Check if user exists
    if (users.has(email.toLowerCase())) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Create user
    const userId = `user_${Date.now()}`;
    const now = new Date().toISOString();
    
    const user: User & { password: string } = {
      id: userId,
      email: email.toLowerCase(),
      username,
      name,
      password, // In production, hash this with bcrypt
      createdAt: now,
      updatedAt: now,
    };

    users.set(email.toLowerCase(), user);

    // Generate token
    const token = await signToken({
      userId: user.id,
      email: user.email,
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { user: userWithoutPassword, token },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}
