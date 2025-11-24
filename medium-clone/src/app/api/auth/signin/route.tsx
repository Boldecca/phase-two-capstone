import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { validateEmail } from '@/lib/validators';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Find user in Firebase
    const userQuery = await adminDb.collection('users').where('email', '==', email.toLowerCase()).get();
    
    if (userQuery.empty) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const userDoc = userQuery.docs[0];
    const user = userDoc.data();

    if (user.password !== password) {
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
