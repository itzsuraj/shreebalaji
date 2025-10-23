import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    // Find user by token (you might need to implement proper JWT verification)
    const user = await User.findOne({ authToken: token }).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
