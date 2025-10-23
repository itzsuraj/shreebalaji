import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      );
    }

    // For now, return a basic user structure
    // You can implement proper user authentication later
    return NextResponse.json({
      user: {
        id: 'temp-user-id',
        email: 'user@example.com',
        fullName: 'User',
        phone: '+919999999999',
        createdAt: new Date().toISOString()
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
