import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { validateEmail, validatePassword, validateUsername } from '@/lib/validators';
import { adminDb } from '@/lib/firebase-admin';
import { User } from '@/lib/types';

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
    const existingUser = await adminDb.collection('users').where('email', '==', email.toLowerCase()).get();
    if (!existingUser.empty) {
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
      password,
      createdAt: now,
      updatedAt: now,
    };

    await adminDb.collection('users').doc(userId).set(user);

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
