// COMMENTED OUT - User login API disabled
// Keeping phone + order ID tracking only

/*
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Simple in-memory user storage for demo purposes
// In production, you'd use a proper database
const users: Array<{
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
}> = [];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return success (don't return password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    return NextResponse.json(
      { 
        message: 'Login successful',
        user: userWithoutPassword 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
*/

// Disabled login API - redirect to track order
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: Request) {
  return new Response(
    JSON.stringify({ 
      error: 'Login disabled. Use phone + order ID tracking instead.' 
    }),
    { 
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
